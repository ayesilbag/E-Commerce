-- SiteSettings kolonları — EF migration uygulanmadıysa manuel çalıştırın.
-- Veritabanı: ecom-dev (veya kullandığınız catalog)

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'SiteSettings') AND name = N'PageSeoJson')
BEGIN
    ALTER TABLE SiteSettings ADD PageSeoJson nvarchar(max) NULL;
    ALTER TABLE SiteSettings ADD SeoDefaultDescription nvarchar(500) NULL;
    ALTER TABLE SiteSettings ADD SeoDefaultKeywords nvarchar(500) NULL;
    ALTER TABLE SiteSettings ADD SeoDefaultTitle nvarchar(200) NULL;
    ALTER TABLE SiteSettings ADD SeoOgImageUrl nvarchar(500) NULL;
    ALTER TABLE SiteSettings ADD SeoTwitterHandle nvarchar(100) NULL;
END

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'SiteSettings') AND name = N'StorefrontContentJson')
BEGIN
    ALTER TABLE SiteSettings ADD StorefrontContentJson nvarchar(max) NULL;
END

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'SiteSettings') AND name = N'AboutPageTitle')
BEGIN
    ALTER TABLE SiteSettings ADD AboutPageTitle nvarchar(200) NULL;
    ALTER TABLE SiteSettings ADD DeliveryReturnsPageTitle nvarchar(200) NULL;
    ALTER TABLE SiteSettings ADD PrivacyPolicyPageTitle nvarchar(200) NULL;
    ALTER TABLE SiteSettings ADD DistanceSellingAgreementPageTitle nvarchar(200) NULL;
    ALTER TABLE SiteSettings ADD PreInformationFormPageTitle nvarchar(200) NULL;
END

IF NOT EXISTS (SELECT 1 FROM __EFMigrationsHistory WHERE MigrationId = N'20260606000000_AddSiteSettingsSeo')
    INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES (N'20260606000000_AddSiteSettingsSeo', N'9.0.0');

IF NOT EXISTS (SELECT 1 FROM __EFMigrationsHistory WHERE MigrationId = N'20260606120000_AddSiteSettingsStorefrontContent')
    INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES (N'20260606120000_AddSiteSettingsStorefrontContent', N'9.0.0');

IF NOT EXISTS (SELECT 1 FROM __EFMigrationsHistory WHERE MigrationId = N'20260606140000_AddSiteSettingsLegalPageTitles')
    INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES (N'20260606140000_AddSiteSettingsLegalPageTitles', N'9.0.0');
