using System.Net;
using System.Reflection;
using System.Text;

namespace ECommerce.Infrastructure.Email;

public class EmailTemplateRenderer
{
    private const string LayoutResourceName = "ECommerce.Infrastructure.Email.Templates.Layout.html";
    private readonly string _brandName;
    private readonly string _brandTag;
    private readonly string _brandInitial;

    public EmailTemplateRenderer(IConfiguration configuration)
    {
        _brandName = configuration["EmailSettings:BrandName"] ?? "Digitalep";
        _brandTag = configuration["EmailSettings:BrandTag"] ?? "E-Commerce";
        _brandInitial = configuration["EmailSettings:BrandInitial"] ?? "D";
    }

    public string Render(EmailTemplateModel model)
    {
        var layout = LoadLayout();
        var greeting = string.IsNullOrWhiteSpace(model.GreetingName)
            ? "Hoş geldiniz"
            : $"Hoş geldiniz, {model.GreetingName}";

        return layout
            .Replace("{{Preheader}}", Encode(model.Preheader))
            .Replace("{{Heading}}", Encode(model.Heading))
            .Replace("{{Greeting}}", Encode(greeting))
            .Replace("{{Intro}}", Encode(model.Intro))
            .Replace("{{BodyHtml}}", model.BodyHtml)
            .Replace("{{BrandName}}", Encode(model.BrandName))
            .Replace("{{BrandTag}}", Encode(model.BrandTag))
            .Replace("{{BrandInitial}}", Encode(model.BrandInitial))
            .Replace("{{Year}}", DateTime.UtcNow.Year.ToString());
    }

    public string RenderActionButton(string url, string label) =>
        $"""
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;">
          <tr>
            <td align="left" style="border-radius:8px;background:linear-gradient(135deg,#5b4cdb 0%,#7c3aed 50%,#a855f7 100%);box-shadow:0 8px 32px rgba(91,76,219,0.25);">
              <a href="{EncodeAttribute(url)}" target="_blank" style="display:inline-block;padding:10px 18px;font-size:14px;font-weight:600;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:8px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;">{Encode(label)}</a>
            </td>
          </tr>
        </table>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;word-break:break-all;">Buton çalışmıyorsa bağlantıyı tarayıcınıza yapıştırın:<br /><a href="{EncodeAttribute(url)}" style="color:#5b4cdb;text-decoration:underline;">{Encode(url)}</a></p>
        """;

    public string RenderCodeBlock(string code) =>
        $"""
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;">
          <tr>
            <td style="padding:24px;background-color:#eef0f6;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 1px 2px rgba(15,23,42,0.04);">
              <span style="display:block;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#94a3b8;">Doğrulama kodu</span>
              <span style="display:block;margin-top:12px;font-size:34px;line-height:1.15;font-weight:700;letter-spacing:0.14em;color:#5b4cdb;font-family:Consolas,'Courier New',monospace;">{Encode(code)}</span>
            </td>
          </tr>
        </table>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#64748b;">Bu kod kısa süre içinde geçerliliğini yitirir. Kodu kimseyle paylaşmayın.</p>
        """;

    public string RenderInfoBox(string text) =>
        $"""
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0 0;">
          <tr>
            <td style="padding:14px 16px;background-color:#f0eefb;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;line-height:1.6;color:#475569;font-family:'Plus Jakarta Sans',system-ui,sans-serif;">{Encode(text)}</td>
          </tr>
        </table>
        """;

    private EmailTemplateModel CreateBaseModel(string? greetingName) =>
        new()
        {
            GreetingName = greetingName,
            BrandName = _brandName,
            BrandTag = _brandTag,
            BrandInitial = _brandInitial,
            Preheader = string.Empty,
            Heading = string.Empty,
            Intro = string.Empty,
            BodyHtml = string.Empty
        };

    public EmailTemplateModel CreateConfirmationModel(string? greetingName, string confirmationLink)
    {
        var model = CreateBaseModel(greetingName);
        return model with
        {
            Preheader = "E-posta adresinizi doğrulamak için güvenli bağlantı.",
            Heading = "E-posta doğrulama",
            Intro = "Hesabınızı güvenle kullanmaya başlamak için e-posta adresinizi doğrulamanız gerekiyor.",
            BodyHtml = RenderActionButton(confirmationLink, "E-postamı doğrula")
                + RenderInfoBox("Doğrulama tamamlandıktan sonra giriş yapabilir ve tüm özellikleri kullanabilirsiniz.")
        };
    }

    public EmailTemplateModel CreatePasswordResetLinkModel(string? greetingName, string resetLink)
    {
        var model = CreateBaseModel(greetingName);
        return model with
        {
            Preheader = "Şifrenizi sıfırlamak için güvenli bağlantı.",
            Heading = "Şifre sıfırlama",
            Intro = "Hesabınız için bir şifre sıfırlama talebi aldık. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.",
            BodyHtml = RenderActionButton(resetLink, "Şifremi sıfırla")
                + RenderInfoBox("Bu talebi siz başlatmadıysanız hesabınız güvende; herhangi bir işlem yapmanıza gerek yok.")
        };
    }

    public EmailTemplateModel CreatePasswordResetCodeModel(string? greetingName, string resetCode)
    {
        var model = CreateBaseModel(greetingName);
        return model with
        {
            Preheader = "Şifre sıfırlama kodunuz hazır.",
            Heading = "Şifre sıfırlama kodu",
            Intro = "Uygulamadaki şifre sıfırlama ekranına aşağıdaki kodu girerek yeni şifrenizi belirleyebilirsiniz.",
            BodyHtml = RenderCodeBlock(resetCode)
                + RenderInfoBox("Kodu girdikten sonra yeni şifrenizi belirleyebilirsiniz.")
        };
    }

    private static string LoadLayout()
    {
        var assembly = Assembly.GetExecutingAssembly();
        using var stream = assembly.GetManifestResourceStream(LayoutResourceName)
            ?? throw new InvalidOperationException($"E-posta şablonu bulunamadı: {LayoutResourceName}");

        using var reader = new StreamReader(stream, Encoding.UTF8);
        return reader.ReadToEnd();
    }

    private static string Encode(string value) =>
        WebUtility.HtmlEncode(value);

    private static string EncodeAttribute(string value) =>
        WebUtility.HtmlEncode(value);
}
