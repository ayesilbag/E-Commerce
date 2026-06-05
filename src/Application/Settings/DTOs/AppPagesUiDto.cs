namespace ECommerce.Application.Settings.DTOs;

public class AppPagesUiDto
{
    public GlobalUiDto? Global { get; set; }
    public AuthUiDto? Auth { get; set; }
    public AccountUiDto? Account { get; set; }
    public CartUiDto? Cart { get; set; }
    public WishlistUiDto? Wishlist { get; set; }
    public ShopUiDto? Shop { get; set; }
    public CheckoutUiDto? Checkout { get; set; }
    public OrdersUiDto? Orders { get; set; }
    public ProductUiDto? Product { get; set; }
    public CategoryUiDto? Category { get; set; }
    public ContextUiDto? Context { get; set; }
}

public class GlobalUiDto
{
    public string? LoadingLabel { get; set; }
    public string? CloseLabel { get; set; }
    public string? ProductFallbackName { get; set; }
    public string? ErrorTitle { get; set; }
    public string? ErrorMessage { get; set; }
    public string? RetryButtonLabel { get; set; }
    public string? HomeButtonLabel { get; set; }
    public string? ErrorBoundaryTitle { get; set; }
    public string? ErrorBoundaryMessage { get; set; }
    public string? ErrorBoundaryReloadButton { get; set; }
}

public class AuthUiDto
{
    public string? LoginTitle { get; set; }
    public string? LoginSubtitle { get; set; }
    public string? EmailLabel { get; set; }
    public string? EmailPlaceholder { get; set; }
    public string? PasswordLabel { get; set; }
    public string? PasswordPlaceholder { get; set; }
    public string? ForgotPasswordLink { get; set; }
    public string? RememberMeLabel { get; set; }
    public string? LoginButtonLabel { get; set; }
    public string? LoginSubmittingLabel { get; set; }
    public string? LoginErrorTitle { get; set; }
    public string? LoginErrorFallback { get; set; }
    public string? LoginNoAccountText { get; set; }
    public string? LoginRegisterLink { get; set; }
    public string? RegisterTitle { get; set; }
    public string? RegisterSubtitle { get; set; }
    public string? RegisterButtonLabel { get; set; }
    public string? RegisterSubmittingLabel { get; set; }
    public string? RegisterSuccessTitle { get; set; }
    public string? RegisterSuccessDescription { get; set; }
    public string? RegisterErrorTitle { get; set; }
    public string? RegisterErrorFallback { get; set; }
    public string? RegisterValidationErrorTitle { get; set; }
    public string? RegisterEmptyFieldsMessage { get; set; }
    public string? RegisterKvkkRequiredMessage { get; set; }
    public string? RegisterPasswordMinMessage { get; set; }
    public string? RegisterHasAccountText { get; set; }
    public string? RegisterLoginLink { get; set; }
    public string? RegisterKvkkConsentText { get; set; }
    public string? ForgotTitle { get; set; }
    public string? ForgotSubtitle { get; set; }
    public string? ForgotSuccessTitle { get; set; }
    public string? ForgotSuccessSubtitle { get; set; }
    public string? ForgotBackToLogin { get; set; }
    public string? ForgotSubmitLabel { get; set; }
    public string? ForgotSubmittingLabel { get; set; }
    public string? ForgotResendLabel { get; set; }
    public string? ForgotSuccessToastTitle { get; set; }
    public string? ForgotSuccessToastDescription { get; set; }
    public string? ForgotErrorTitle { get; set; }
    public string? ForgotEmptyEmailMessage { get; set; }
    public string? ForgotErrorFallback { get; set; }
    public string? ForgotLoginPrompt { get; set; }
    public string? ForgotLoginLink { get; set; }
    public string? ResetPasswordTitle { get; set; }
    public string? ResetPasswordSuccessTitle { get; set; }
    public string? ResetPasswordSuccessDescription { get; set; }
    public string? ResetPasswordNewLabel { get; set; }
    public string? ResetPasswordConfirmLabel { get; set; }
    public string? ResetPasswordConfirmPlaceholder { get; set; }
    public string? ResetPasswordSubmitLabel { get; set; }
    public string? ResetPasswordSubmittingLabel { get; set; }
    public string? ResetPasswordChangedTitle { get; set; }
    public string? ResetPasswordChangedDescription { get; set; }
    public string? ResetPasswordLoginButton { get; set; }
    public string? ResetPasswordInvalidLinkTitle { get; set; }
    public string? ResetPasswordInvalidLinkDescription { get; set; }
    public string? ResetPasswordSuccessToastTitle { get; set; }
    public string? ResetPasswordSuccessToastDescription { get; set; }
    public string? ResetPasswordErrorTitle { get; set; }
    public string? ResetPasswordRequiredMessage { get; set; }
    public string? ResetPasswordMinLengthMessage { get; set; }
    public string? ResetPasswordMismatchMessage { get; set; }
}

public class AccountUiDto
{
    public string? PageTitle { get; set; }
    public string? GuestNameFallback { get; set; }
    public string? MemberSincePrefix { get; set; }
    public string? NavAccount { get; set; }
    public string? NavOrders { get; set; }
    public string? NavWishlist { get; set; }
    public string? NavAddresses { get; set; }
    public string? NavPaymentMethods { get; set; }
    public string? LogoutButton { get; set; }
    public string? OrdersCardTitle { get; set; }
    public string? OrdersCardSubtitle { get; set; }
    public string? CartCardTitle { get; set; }
    public string? CartCardSubtitle { get; set; }
    public string? WishlistCardTitle { get; set; }
    public string? WishlistCardSubtitle { get; set; }
    public string? OrdersTabLabel { get; set; }
    public string? EmptyOrdersTitle { get; set; }
    public string? EmptyOrdersDescription { get; set; }
    public string? EmptyOrdersButton { get; set; }
    public string? ProductUnitLabel { get; set; }
    public string? ViewOrderButton { get; set; }
    public string? OrdersLoadError { get; set; }
}

public class CartUiDto
{
    public string? TitlePrefix { get; set; }
    public string? EmptyTitle { get; set; }
    public string? EmptyDescription { get; set; }
    public string? ContinueShoppingButton { get; set; }
    public string? SubtotalLabel { get; set; }
    public string? ShippingNote { get; set; }
    public string? CheckoutButton { get; set; }
    public string? LoginRequiredNote { get; set; }
    public string? LoginAndContinueButton { get; set; }
}

public class WishlistUiDto
{
    public string? SidebarTitlePrefix { get; set; }
    public string? SidebarEmptyTitle { get; set; }
    public string? SidebarEmptyDescription { get; set; }
    public string? SidebarExploreButton { get; set; }
    public string? SidebarAddToCartLabel { get; set; }
    public string? SidebarContinueButton { get; set; }
    public string? PageTitle { get; set; }
    public string? PageProductUnit { get; set; }
    public string? PageContinueShopping { get; set; }
    public string? PageAddAllToCart { get; set; }
    public string? PageEmptyTitle { get; set; }
    public string? PageEmptyDescription { get; set; }
    public string? PageStartShopping { get; set; }
    public string? AddAllSuccessToast { get; set; }
    public string? AddAllErrorToast { get; set; }
}

public class LabeledOptionDto
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
}

public class ShopUiDto
{
    public string? ProductsLoadError { get; set; }
    public string? CategoriesLoadError { get; set; }
    public string? FiltersButtonLabel { get; set; }
    public string? ClearFiltersLabel { get; set; }
    public string? SearchPlaceholder { get; set; }
    public string? SortLabel { get; set; }
    public string? ResultsLabel { get; set; }
    public string? EmptyTitle { get; set; }
    public string? EmptyDescription { get; set; }
    public string? LoadMoreLabel { get; set; }
    public string? LoadingLabel { get; set; }
    public IReadOnlyList<LabeledOptionDto> SortOptions { get; set; } = [];
    public string? FilterCategoryTitle { get; set; }
    public string? FilterGenderTitle { get; set; }
    public string? FilterSizeTitle { get; set; }
    public string? FilterColorTitle { get; set; }
    public string? FilterPriceTitle { get; set; }
    public string? FilterFitTitle { get; set; }
    public string? FilterSleeveTitle { get; set; }
    public string? FilterNeckTitle { get; set; }
    public string? FilterMaterialTitle { get; set; }
    public string? FilterSeasonTitle { get; set; }
    public string? FilterPatternTitle { get; set; }
    public string? FilterQualityTitle { get; set; }
    public IReadOnlyList<string> GenderOptions { get; set; } = [];
    public IReadOnlyList<string> SizeOptions { get; set; } = [];
    public IReadOnlyList<string> ColorOptions { get; set; } = [];
    public IReadOnlyList<LabeledOptionDto> PriceRangeOptions { get; set; } = [];
    public IReadOnlyList<string> FitOptions { get; set; } = [];
    public IReadOnlyList<string> SleeveOptions { get; set; } = [];
    public IReadOnlyList<string> NeckOptions { get; set; } = [];
    public IReadOnlyList<string> MaterialOptions { get; set; } = [];
    public IReadOnlyList<string> SeasonOptions { get; set; } = [];
    public IReadOnlyList<string> PatternOptions { get; set; } = [];
    public IReadOnlyList<string> QualityOptions { get; set; } = [];
}

public class CheckoutUiDto
{
    public string? DefaultCountry { get; set; }
    public string? ValidationErrorTitle { get; set; }
    public string? ValidationErrorMessage { get; set; }
    public string? SelectAddressError { get; set; }
    public string? AddressTabLabel { get; set; }
    public string? PaymentTabLabel { get; set; }
    public string? SavedAddressesTitle { get; set; }
    public string? NoAddressYet { get; set; }
    public string? DefaultAddressBadge { get; set; }
    public string? PhonePrefix { get; set; }
    public string? AddAddressTitle { get; set; }
    public string? FullNameLabel { get; set; }
    public string? FullNamePlaceholder { get; set; }
    public string? PhoneLabel { get; set; }
    public string? AddressLabel { get; set; }
    public string? AddressPlaceholder { get; set; }
    public string? CityLabel { get; set; }
    public string? CityPlaceholder { get; set; }
    public string? DistrictLabel { get; set; }
    public string? DistrictPlaceholder { get; set; }
    public string? DistrictSelectCityFirst { get; set; }
    public string? PostalCodeLabel { get; set; }
    public string? DefaultAddressCheckbox { get; set; }
    public string? SaveAddressSubmitting { get; set; }
    public string? SaveAddressButton { get; set; }
    public string? CancelButton { get; set; }
    public string? AddAddressButton { get; set; }
    public string? OrderSummaryTitle { get; set; }
    public string? MoreItemsNote { get; set; }
    public string? CartTotalLabel { get; set; }
    public string? ShippingFeeLabel { get; set; }
    public string? GrandTotalLabel { get; set; }
    public string? ContinueToPaymentButton { get; set; }
    public IReadOnlyList<string> Cities { get; set; } = [];
    public Dictionary<string, List<string>> DistrictsByCity { get; set; } = new();
    public string? DeleteAddressConfirm { get; set; }
    public string? ContractsRequiredMessage { get; set; }
    public string? PaymentErrorTitle { get; set; }
    public string? PaymentErrorFallback { get; set; }
    public string? OrderCreateErrorFallback { get; set; }
    public string? ShippingOptionsTitle { get; set; }
    public string? ShippingLoadingLabel { get; set; }
    public string? ShippingLoadError { get; set; }
    public string? PaymentOptionsTitle { get; set; }
    public string? PaymentLoadingLabel { get; set; }
    public string? PaymentOptionsLoadError { get; set; }
    public string? BankAccountsLoadError { get; set; }
    public string? IyzicoPayButton { get; set; }
    public string? IyzicoRedirectingLabel { get; set; }
    public string? IyzicoSecurityNote { get; set; }
    public string? BankTransferTitle { get; set; }
    public string? BankTransferSubtitle { get; set; }
    public string? BankTransferNote { get; set; }
    public string? CopyIbanButton { get; set; }
    public string? CreateOrderBankTransferSubmitting { get; set; }
    public string? CreateOrderBankTransferButton { get; set; }
    public string? HavaleInstructionsTitle { get; set; }
    public string? OrderNumberLabel { get; set; }
    public string? GoToOrdersButton { get; set; }
    public string? AlreadyHaveAccountText { get; set; }
    public string? LoginLink { get; set; }
    public string? HavaleSuccessTitle { get; set; }
    public string? HavaleSuccessDescription { get; set; }
    public string? OrderDetailLoadError { get; set; }
    public string? OrderNotFound { get; set; }
    public string? BackToAccountButton { get; set; }
    public string? BackButton { get; set; }
    public string? OrderNumberPrefix { get; set; }
    public string? OrderDatePrefix { get; set; }
    public string? TrackingNumberPrefix { get; set; }
    public string? PaymentInfoTitle { get; set; }
    public string? StatusLabel { get; set; }
    public string? PaymentMethodLabel { get; set; }
    public string? CardLabel { get; set; }
    public string? TransactionIdLabel { get; set; }
    public string? ProductsTitle { get; set; }
    public string? QuantityPrefix { get; set; }
    public string? ColorPrefix { get; set; }
    public string? SizePrefix { get; set; }
    public string? ShippingAddressTitle { get; set; }
    public string? SubtotalLabel { get; set; }
    public string? DiscountLabel { get; set; }
    public string? TaxLabel { get; set; }
    public string? TotalLabel { get; set; }
    public string? ShippingMethodTitle { get; set; }
    public string? EstimatedDeliveryPrefix { get; set; }
    public string? CompletePaymentButton { get; set; }
    public string? CancelOrderButton { get; set; }
    public string? CancelDialogTitle { get; set; }
    public string? CancelDialogDescription { get; set; }
    public string? CancelReasonPlaceholder { get; set; }
    public string? CancelDialogDismiss { get; set; }
    public string? CancelDialogConfirm { get; set; }
    public string? CancelDialogSubmitting { get; set; }
    public string? PaymentResultCheckingTitle { get; set; }
    public string? PaymentResultPollNote { get; set; }
    public string? PaymentResultMissingOrderTitle { get; set; }
    public string? PaymentResultMissingOrderDescription { get; set; }
    public string? PaymentResultSuccessTitle { get; set; }
    public string? PaymentResultSuccessDescription { get; set; }
    public string? PaymentResultFailedTitle { get; set; }
    public string? PaymentResultFailedDescription { get; set; }
    public string? PaymentResultRefundedTitle { get; set; }
    public string? PaymentResultRefundedDescription { get; set; }
    public string? PaymentResultPendingTitle { get; set; }
    public string? PaymentResultPendingDescription { get; set; }
    public string? RefreshButton { get; set; }
    public string? RetryPaymentButton { get; set; }
    public string? OrderDetailsTitle { get; set; }
    public string? PaymentResultFailedBanner { get; set; }
    public string? ViewOrderDetailButton { get; set; }
    public string? ContinueShoppingButton { get; set; }
    public IReadOnlyList<LabeledOptionDto> OrderStatusLabels { get; set; } = [];
    public IReadOnlyList<LabeledOptionDto> PaymentStatusLabels { get; set; } = [];
    public string? AddressesPageTitle { get; set; }
    public string? AddressesBackNav { get; set; }
    public string? AddressesEmptyLine1 { get; set; }
    public string? AddressesEmptyLine2 { get; set; }
    public string? AddressesDefaultBadge { get; set; }
    public string? AddressesDeleteTitle { get; set; }
    public string? AddressesDeleteDescription { get; set; }
    public string? AddressesDeleteConfirm { get; set; }
    public string? AddressesEditTitle { get; set; }
    public string? AddressesAddTitle { get; set; }
    public string? AddressesUpdateSubmitting { get; set; }
    public string? AddressesUpdateButton { get; set; }
    public string? PaymentMethodsPageTitle { get; set; }
    public string? PaymentMethodsBackNav { get; set; }
    public string? PaymentMethodsSecurityNote { get; set; }
    public string? PaymentMethodsEmpty { get; set; }
    public string? PaymentMethodsLoadError { get; set; }
    public string? PaymentMethodsCardFallback { get; set; }
}

public class OrdersUiDto
{
    public string? PageTitle { get; set; }
    public string? PageSubtitle { get; set; }
    public string? SearchPlaceholder { get; set; }
    public string? AllStatusesLabel { get; set; }
    public string? LoadErrorTitle { get; set; }
    public string? LoadErrorFallback { get; set; }
    public string? RetryButton { get; set; }
    public string? EmptyFilteredTitle { get; set; }
    public string? EmptyTitle { get; set; }
    public string? EmptyFilteredDescription { get; set; }
    public string? EmptyDescription { get; set; }
    public string? StartShoppingButton { get; set; }
    public string? ProductUnitLabel { get; set; }
    public string? PaymentPendingBadge { get; set; }
    public string? TotalLabel { get; set; }
    public string? PayButton { get; set; }
    public string? DetailButton { get; set; }
    public string? PreviousPage { get; set; }
    public string? NextPage { get; set; }
    public string? PageLabel { get; set; }
    public IReadOnlyList<LabeledOptionDto> StatusOptions { get; set; } = [];
}

public class ProductUiDto
{
    public string? NotFoundIdError { get; set; }
    public string? LoadError { get; set; }
    public string? LoadingLabel { get; set; }
    public string? NotFoundTitle { get; set; }
    public string? BackToShopButton { get; set; }
    public string? CategorySpecLabel { get; set; }
    public string? StockSpecSuffix { get; set; }
    public string? OutOfStockTitle { get; set; }
    public string? OutOfStockDescription { get; set; }
    public string? AddedToCartTitle { get; set; }
    public string? AddedToCartDescription { get; set; }
    public string? ShareCopiedToast { get; set; }
    public string? BreadcrumbHome { get; set; }
    public string? BreadcrumbShop { get; set; }
    public string? SaleBadge { get; set; }
    public string? NewBadge { get; set; }
    public string? ReviewsLabel { get; set; }
    public string? DiscountBadge { get; set; }
    public string? ColorLabel { get; set; }
    public string? ColorPlaceholder { get; set; }
    public string? SizeLabel { get; set; }
    public string? SizePlaceholder { get; set; }
    public string? QuantityLabel { get; set; }
    public string? AddToCartButton { get; set; }
    public string? RemoveFromWishlistButton { get; set; }
    public string? AddToWishlistButton { get; set; }
    public string? ShareButtonTitle { get; set; }
    public string? InStockTitle { get; set; }
    public string? OutOfStockStatusTitle { get; set; }
    public string? StockCountLabel { get; set; }
    public string? FastDeliveryTitle { get; set; }
    public string? FastDeliveryDescription { get; set; }
    public string? PaymentOptionsTitle { get; set; }
    public string? PaymentOptionsDescription { get; set; }
    public string? WarrantyTitle { get; set; }
    public string? WarrantyDescription { get; set; }
    public string? TagsSectionTitle { get; set; }
    public string? TabDescription { get; set; }
    public string? TabSpecs { get; set; }
    public string? TabReviews { get; set; }
    public string? DescriptionHeading { get; set; }
    public string? EmptyDescription { get; set; }
    public string? SpecsHeading { get; set; }
    public string? EmptySpecs { get; set; }
    public string? ReviewsHeading { get; set; }
    public string? ReviewsSummary { get; set; }
    public string? WriteReviewButton { get; set; }
    public string? SimilarProductsTitle { get; set; }
    public string? ViewAllLink { get; set; }
    public string? CardAddToCartButton { get; set; }
    public string? CardAddToCartSubmitting { get; set; }
    public string? CardAddSuccessTitle { get; set; }
    public string? CardAddErrorToast { get; set; }
    public string? CardWishlistAriaLabel { get; set; }
}

public class CategoryUiDto
{
    public string? LoadError { get; set; }
    public string? AllCategoriesTitle { get; set; }
    public string? CategoryProductsSubtitle { get; set; }
    public string? AllCategoriesSubtitle { get; set; }
    public string? ProductsSectionTitle { get; set; }
    public string? ViewModeLabel { get; set; }
    public string? EmptyTitle { get; set; }
    public string? EmptyDescription { get; set; }
    public string? ViewAllProductsButton { get; set; }
    public string? SectionTitle { get; set; }
    public string? ViewAllLink { get; set; }
}

public class ContextUiDto
{
    public string? CartAddSuccessTitle { get; set; }
    public string? CartAddErrorTitle { get; set; }
    public string? CartAddErrorFallback { get; set; }
    public string? CartRemoveInfoTitle { get; set; }
    public string? CartRemoveInfoDescription { get; set; }
    public string? CartRemoveErrorTitle { get; set; }
    public string? CartRemoveErrorFallback { get; set; }
    public string? CartQuantityErrorTitle { get; set; }
    public string? CartClearSuccessTitle { get; set; }
    public string? CartClearErrorTitle { get; set; }
    public string? CartClearErrorFallback { get; set; }
    public string? WishlistAlreadyInTitle { get; set; }
    public string? WishlistAddSuccessTitle { get; set; }
    public string? WishlistAddErrorTitle { get; set; }
    public string? WishlistRemoveInfoTitle { get; set; }
    public string? WishlistRemoveInfoDescription { get; set; }
    public string? WishlistRemoveErrorTitle { get; set; }
    public string? WishlistRemoveErrorFallback { get; set; }
}
