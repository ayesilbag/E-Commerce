using ECommerce.Application.Settings;
using ECommerce.Application.Settings.DTOs;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Data.Seeding.SiteSettings;

/// <summary>
/// SiteSettings kayıtlarını seed eder. Mevcut kayıtlarda yalnızca boş alanları doldurur;
/// yanlış marka verisi tespit edilirse ilgili UI kaydı baştan yazılır.
/// </summary>
public static class SiteSettingsSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger, CancellationToken cancellationToken = default)
    {
        var changed = false;

        foreach (var profile in SiteSettingsSeedProfiles.All)
        {
            var existing = await context.SiteSettings
                .FirstOrDefaultAsync(s => s.Code == profile.Code, cancellationToken);

            if (existing is null)
            {
                context.SiteSettings.Add(BuildEntity(profile));
                logger.LogInformation("Site settings seed oluşturuldu: {Code}", profile.Code);
                changed = true;
                continue;
            }

            if (HasCrossBrandContamination(existing, profile))
            {
                ApplySeedData(existing, profile);
                logger.LogWarning("Yanlış marka verisi düzeltildi, seed yeniden uygulandı: {Code}", profile.Code);
                changed = true;
                continue;
            }

            if (FillMissingFields(existing, profile))
            {
                logger.LogInformation("Site settings eksik alanları dolduruldu: {Code}", profile.Code);
                changed = true;
            }
        }

        if (changed)
            await context.SaveChangesAsync(cancellationToken);
    }

    private static Domain.Entities.SiteSettings BuildEntity(SiteSettingsBrandProfile profile)
    {
        var entity = new Domain.Entities.SiteSettings
        {
            Code = profile.Code,
            Name = profile.AdminName,
            IsActive = true,
            IsDefault = profile.IsDefault,
        };
        ApplySeedData(entity, profile);
        return entity;
    }

    private static void ApplySeedData(Domain.Entities.SiteSettings entity, SiteSettingsBrandProfile profile)
    {
        var legal = SiteSettingsLegalContentFactory.Create(profile);
        var storefront = SiteSettingsStorefrontContentFactory.Create(profile);
        var seo = SiteSettingsSeoFactory.Create(profile);

        entity.Name = profile.AdminName;
        entity.SiteName = profile.SiteName;
        entity.Domain = profile.Domain;
        entity.Address = SiteSettingsSeedSharedContact.Address;
        entity.Emails = [profile.PrimaryEmail];
        entity.Phones = SiteSettingsSeedSharedContact.Phones.ToList();
        entity.WorkingHours = SiteSettingsSeedSharedContact.WorkingHours.ToList();
        entity.AboutPageTitle = legal.AboutTitle;
        entity.AboutPageContent = legal.AboutContent;
        entity.DeliveryReturnsPageTitle = legal.DeliveryReturnsTitle;
        entity.DeliveryReturnsPageContent = legal.DeliveryReturnsContent;
        entity.PrivacyPolicyPageTitle = legal.PrivacyTitle;
        entity.PrivacyPolicyPageContent = legal.PrivacyContent;
        entity.DistanceSellingAgreementPageTitle = legal.DistanceSellingTitle;
        entity.DistanceSellingAgreementPageContent = legal.DistanceSellingContent;
        entity.PreInformationFormPageTitle = legal.PreInformationTitle;
        entity.PreInformationFormPageContent = legal.PreInformationContent;
        entity.IyzicoPayLogoUrl = SiteSettingsSeedSharedContact.IyzicoPayLogoUrl;
        entity.ThemePrimaryLight = profile.ThemePrimaryLight;
        entity.ThemePrimaryDark = profile.ThemePrimaryDark;
        entity.ThemeFontFamily = profile.ThemeFontFamily;
        entity.IsActive = true;
        entity.IsDefault = profile.IsDefault;

        SiteStorefrontContentRules.Apply(entity, storefront);
        SiteSeoRules.Apply(entity, seo);
    }

    private static bool HasCrossBrandContamination(Domain.Entities.SiteSettings entity, SiteSettingsBrandProfile profile)
    {
        var foreignProfiles = SiteSettingsSeedProfiles.All
            .Where(p => !p.Code.Equals(profile.Code, StringComparison.OrdinalIgnoreCase));

        foreach (var foreign in foreignProfiles)
        {
            if (ContainsAnyMarker(entity, SiteSettingsBrandMarkers.MarkersFor(foreign)))
                return true;
        }

        return false;
    }

    private static bool ContainsAnyMarker(Domain.Entities.SiteSettings entity, IEnumerable<string> markers)
    {
        var haystack = string.Join('\n',
        [
            entity.Name,
            entity.SiteName,
            entity.Domain,
            entity.Address,
            string.Join(',', entity.Emails),
            entity.AboutPageTitle,
            entity.AboutPageContent,
            entity.DeliveryReturnsPageContent,
            entity.PrivacyPolicyPageContent,
            entity.DistanceSellingAgreementPageContent,
            entity.PreInformationFormPageContent,
            entity.StorefrontContentJson,
            entity.PageSeoJson,
            entity.SeoDefaultTitle,
            entity.SeoDefaultDescription,
            entity.SeoDefaultKeywords,
        ]);

        return markers.Any(marker =>
            !string.IsNullOrWhiteSpace(marker)
            && haystack.Contains(marker, StringComparison.OrdinalIgnoreCase));
    }

    private static bool FillMissingFields(Domain.Entities.SiteSettings entity, SiteSettingsBrandProfile profile)
    {
        var changed = false;
        var legal = SiteSettingsLegalContentFactory.Create(profile);

        changed |= SetIfEmpty(entity.Name, profile.AdminName, v => entity.Name = v);
        changed |= SetIfEmpty(entity.SiteName, profile.SiteName, v => entity.SiteName = v);
        changed |= SetIfEmpty(entity.Domain, profile.Domain, v => entity.Domain = v);
        changed |= SetIfEmpty(entity.Address, SiteSettingsSeedSharedContact.Address, v => entity.Address = v);

        if (entity.Emails.Count == 0 || entity.Emails.All(string.IsNullOrWhiteSpace))
        {
            entity.Emails = [profile.PrimaryEmail];
            changed = true;
        }

        if (entity.Phones.Count == 0)
        {
            entity.Phones = SiteSettingsSeedSharedContact.Phones.ToList();
            changed = true;
        }

        if (entity.WorkingHours.Count == 0)
        {
            entity.WorkingHours = SiteSettingsSeedSharedContact.WorkingHours.ToList();
            changed = true;
        }

        changed |= SetIfEmpty(entity.AboutPageTitle, legal.AboutTitle, v => entity.AboutPageTitle = v);
        changed |= SetIfEmpty(entity.AboutPageContent, legal.AboutContent, v => entity.AboutPageContent = v);
        changed |= SetIfEmpty(entity.DeliveryReturnsPageTitle, legal.DeliveryReturnsTitle, v => entity.DeliveryReturnsPageTitle = v);
        changed |= SetIfEmpty(entity.DeliveryReturnsPageContent, legal.DeliveryReturnsContent, v => entity.DeliveryReturnsPageContent = v);
        changed |= SetIfEmpty(entity.PrivacyPolicyPageTitle, legal.PrivacyTitle, v => entity.PrivacyPolicyPageTitle = v);
        changed |= SetIfEmpty(entity.PrivacyPolicyPageContent, legal.PrivacyContent, v => entity.PrivacyPolicyPageContent = v);
        changed |= SetIfEmpty(entity.DistanceSellingAgreementPageTitle, legal.DistanceSellingTitle, v => entity.DistanceSellingAgreementPageTitle = v);
        changed |= SetIfEmpty(entity.DistanceSellingAgreementPageContent, legal.DistanceSellingContent, v => entity.DistanceSellingAgreementPageContent = v);
        changed |= SetIfEmpty(entity.PreInformationFormPageTitle, legal.PreInformationTitle, v => entity.PreInformationFormPageTitle = v);
        changed |= SetIfEmpty(entity.PreInformationFormPageContent, legal.PreInformationContent, v => entity.PreInformationFormPageContent = v);
        changed |= SetIfEmpty(entity.IyzicoPayLogoUrl, SiteSettingsSeedSharedContact.IyzicoPayLogoUrl, v => entity.IyzicoPayLogoUrl = v);

        changed |= SetIfEmpty(entity.ThemePrimaryLight, profile.ThemePrimaryLight, v => entity.ThemePrimaryLight = v);
        changed |= SetIfEmpty(entity.ThemePrimaryDark, profile.ThemePrimaryDark, v => entity.ThemePrimaryDark = v);

        if (string.IsNullOrWhiteSpace(entity.StorefrontContentJson))
        {
            SiteStorefrontContentRules.Apply(entity, SiteSettingsStorefrontContentFactory.Create(profile));
            changed = true;
        }

        if (string.IsNullOrWhiteSpace(entity.SeoDefaultTitle))
        {
            SiteSeoRules.Apply(entity, SiteSettingsSeoFactory.Create(profile));
            changed = true;
        }

        return changed;
    }

    private static bool SetIfEmpty(string? current, string value, Action<string> setter)
    {
        if (!string.IsNullOrWhiteSpace(current)) return false;
        setter(value);
        return true;
    }
}
