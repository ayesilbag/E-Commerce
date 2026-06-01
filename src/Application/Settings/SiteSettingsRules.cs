using System.Text.RegularExpressions;

namespace ECommerce.Application.Settings;

public static partial class SiteSettingsRules
{
    private static readonly Regex CodePattern = CodeRegex();

    public static bool TryNormalizeCode(string? value, out string code)
    {
        code = string.Empty;
        if (string.IsNullOrWhiteSpace(value))
            return false;

        code = value.Trim().ToLowerInvariant();
        return CodePattern.IsMatch(code);
    }

    public static string? NormalizeCodeOrNull(string? value) =>
        TryNormalizeCode(value, out var code) ? code : null;

    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    private static partial Regex CodeRegex();
}
