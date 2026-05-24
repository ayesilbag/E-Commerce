using ClosedXML.Excel;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Services;

public class ProductExcelService
{
    private static readonly string[] Headers =
    [
        "Ad", "SKU", "Kategori", "Fiyat", "Stok", "Açıklama", "Görsel URL", "Aktif"
    ];

    public byte[] CreateTemplate()
    {
        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Urunler");
        for (var i = 0; i < Headers.Length; i++)
        {
            sheet.Cell(1, i + 1).Value = Headers[i];
            sheet.Cell(1, i + 1).Style.Font.Bold = true;
            sheet.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#EEF0F6");
        }

        sheet.Cell(2, 1).Value = "Örnek Ürün";
        sheet.Cell(2, 2).Value = "SKU-001";
        sheet.Cell(2, 3).Value = "Giyim";
        sheet.Cell(2, 4).Value = 299.99;
        sheet.Cell(2, 5).Value = 50;
        sheet.Cell(2, 6).Value = "Ürün açıklaması";
        sheet.Cell(2, 7).Value = "";
        sheet.Cell(2, 8).Value = "Evet";

        sheet.Columns().AdjustToContents();
        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    public async Task<ProductImportResult> ImportAsync(Stream fileStream, ApplicationDbContext context, CancellationToken cancellationToken)
    {
        var result = new ProductImportResult();
        using var workbook = new XLWorkbook(fileStream);
        var sheet = workbook.Worksheets.First();
        var lastRow = sheet.LastRowUsed()?.RowNumber() ?? 1;

        var headerMap = BuildHeaderMap(sheet);

        for (var row = 2; row <= lastRow; row++)
        {
            try
            {
                var name = GetCell(sheet, row, headerMap, "Ad", "Name");
                var sku = GetCell(sheet, row, headerMap, "SKU", "Sku");
                var category = GetCell(sheet, row, headerMap, "Kategori", "Category");

                if (string.IsNullOrWhiteSpace(name) && string.IsNullOrWhiteSpace(sku))
                {
                    continue;
                }

                if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(sku) || string.IsNullOrWhiteSpace(category))
                {
                    result.Errors.Add($"Satır {row}: Ad, SKU ve Kategori zorunludur.");
                    result.Failed++;
                    continue;
                }

                sku = sku.Trim();
                if (await context.Products.AnyAsync(p => p.Sku == sku && !p.IsDeleted, cancellationToken))
                {
                    result.Errors.Add($"Satır {row}: SKU '{sku}' zaten mevcut.");
                    result.Failed++;
                    continue;
                }

                var price = ParseDecimal(GetCell(sheet, row, headerMap, "Fiyat", "Price")) ?? 0;
                var stock = ParseInt(GetCell(sheet, row, headerMap, "Stok", "Stock")) ?? 0;
                var description = GetCell(sheet, row, headerMap, "Açıklama", "Description");
                var image = GetCell(sheet, row, headerMap, "Görsel URL", "Image", "Gorsel");
                var isActive = ParseBool(GetCell(sheet, row, headerMap, "Aktif", "Active", "IsActive")) ?? true;

                var product = new Product
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = name.Trim(),
                    Sku = sku,
                    Category = category.Trim(),
                    Price = price,
                    Stock = stock,
                    Description = description,
                    Image = image ?? string.Empty,
                    Images = Array.Empty<string>(),
                    Tags = Array.Empty<string>(),
                    IsActive = isActive,
                    Created = DateTimeOffset.UtcNow
                };

                context.Products.Add(product);
                result.Imported++;
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Satır {row}: {ex.Message}");
                result.Failed++;
            }
        }

        if (result.Imported > 0)
        {
            await context.SaveChangesAsync(cancellationToken);
        }

        return result;
    }

    private static Dictionary<string, int> BuildHeaderMap(IXLWorksheet sheet)
    {
        var map = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        var lastCol = sheet.LastColumnUsed()?.ColumnNumber() ?? 0;
        for (var col = 1; col <= lastCol; col++)
        {
            var header = sheet.Cell(1, col).GetString().Trim();
            if (!string.IsNullOrEmpty(header))
            {
                map[header] = col;
            }
        }

        return map;
    }

    private static string? GetCell(IXLWorksheet sheet, int row, Dictionary<string, int> map, params string[] keys)
    {
        foreach (var key in keys)
        {
            if (map.TryGetValue(key, out var col))
            {
                return sheet.Cell(row, col).GetString().Trim();
            }
        }

        return null;
    }

    private static decimal? ParseDecimal(string? value) =>
        decimal.TryParse(value?.Replace(',', '.'), System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out var d) ? d : null;

    private static int? ParseInt(string? value) =>
        int.TryParse(value, out var i) ? i : null;

    private static bool? ParseBool(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var v = value.Trim().ToLowerInvariant();
        return v is "1" or "true" or "evet" or "yes" or "aktif";
    }
}

public class ProductImportResult
{
    public int Imported { get; set; }
    public int Failed { get; set; }
    public List<string> Errors { get; set; } = [];
}
