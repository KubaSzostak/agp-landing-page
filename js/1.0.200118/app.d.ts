import * as agp from "./agp.js";
export declare class AppView {
    private navbarTitleContainer;
    private searchBoxElement;
    private searchButtonElement;
    private groupInfoContainer;
    private groupItemsContainer;
    private loadMoreItemsButton;
    private loadMoreItemsProgress;
    private portalDeltailsFooter;
    private groupDetailsFooter;
    private splashScreenModal;
    private splashScreenBackdrop;
    private portal;
    private group;
    constructor(portalUrl: string, groupId: string);
    loadAppData(): Promise<any>;
    hideSplashScreen(): void;
    showError(err: any): void;
    private setFooterContainerAnchor;
    private supportedPortalVersion;
    setPortalData(portal: agp.PortalJson): void;
    setGroupData(group: agp.GroupJson): void;
    private makeImagesResponsive;
    private lastSearchResult;
    appendItems(searchResult: agp.GroupSearchJson): void;
    private appendItemData;
    private appendMoreItems;
    private appendElement;
    private appendDiv;
    private appendImg;
    private appendAnchor;
}