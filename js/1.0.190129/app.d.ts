interface PortalLandingPageConfig {
    portalUrl: string;
    group: string;
}
declare var arcgisPortalLandingPageConfig: PortalLandingPageConfig;
declare const urlParams: URLSearchParams;
declare let arcgisPortalList: PortalLandingPageConfig[];
interface RestApiJson {
    error: {
        message: string;
        details: string;
    };
}
interface PortalJson extends RestApiJson {
    name: string;
    portalName: string;
    portalThumbnail: string;
    thumbnail: string;
    currentVersion: number;
    portalUrl: string;
    thumbnailUrl: string;
}
interface GroupJson extends RestApiJson {
    title: string;
    description: string;
    snippet: string;
    thumbnail: string;
    id: string;
    sortField: string;
    sortOrder: string;
    groupUrl: string;
    thumbnailUrl: string;
}
interface GroupSearchJson extends RestApiJson {
    start: number;
    num: number;
    nextStart: number;
    total: number;
    query: string;
    results: ItemJson[];
}
declare type ItemType = "Web Map" | "CityEngine Web Scene" | "Web Scene" | "360 VR Experience" | "Pro Map" | "Map Area" | "Feature Service" | "Map Service" | "Image Service" | "KML" | "KML Collection" | "WMS" | "WFS" | "WMTS" | "Feature Collection" | "Feature Collection Template" | "Geodata Service" | "Globe Service" | "Vector Tile Service" | "Scene Service" | "Relational Database Connection" | "Oriented Imagery Catalog" | "Geometry Service" | "Geocoding Service" | "Network Analysis Service" | "Geoprocessing Service" | "Workflow Manager Service";
interface ItemJson {
    id: string;
    title: string;
    name: string;
    snippet: string;
    description: string;
    url: string;
    owner: string;
    created: number;
    modified: number;
    type: ItemType;
    typeKeywords: string[];
    tags: string[];
    thumbnail: string;
    extent: any;
    spatialReference: any;
    accessInformation: string;
    licenseInfo: string;
    culture: string;
    access: "private | shared | org | public";
    size: number;
    numComments: number;
    numRatings: number;
    avgRating: number;
    numViews: number;
    scoreCompleteness: number;
    groupCategories: string[];
    itemUrl: string;
    thumbnailUrl: string;
}
interface ItemsJson {
    items: ItemJson[];
}
declare let isDebugDebugMode: boolean;
declare class AppIcons {
    private static featherIcon;
    static info(size?: number): string;
    static externalLink(size?: number): string;
    static download(size?: number): string;
    static search(size?: number): string;
    static home(size?: number): string;
    static list(size?: number): string;
    static chevronsDown(size?: number): string;
    static map(size?: number): string;
    private static iconicIcon;
    static listRich(size?: number): string;
}
declare function fetchRestApiJson(apiUrl: string): Promise<any>;
declare class AppView {
    portalUrl: string;
    private navbarTitleContainer;
    private searchBoxElement;
    private searchButtonElement;
    private groupHeadingContainer;
    private groupItemsContainer;
    private loadMoreItemsButton;
    private loadMoreItemsProgress;
    private portalDeltailsContainer;
    private groupDetailsContainer;
    private splashScreenModal;
    private splashScreenBackdrop;
    constructor(portalUrl: string);
    hideSplashScreen(): void;
    showError(err: any): void;
    private setFooterContainerAnchor;
    private supportedPortalVersion;
    setPortalData(portal: PortalJson): void;
    setGroupData(group: GroupJson): void;
    private lastSearchResult;
    appendItems(searchResult: GroupSearchJson): void;
    private appendItemData;
    private appendMoreItems;
    private appendElement;
    private appendDiv;
    private appendImg;
    private appendAnchor;
}
declare class AppController {
    portalUrl: string;
    groupId: string;
    view: AppView;
    portal: PortalJson;
    group: GroupJson;
    items: ItemsJson;
    constructor(portalUrl: string, groupId: string);
    loadAppData(): Promise<any>;
    private rootUrl;
    private loadPortalData;
    private loadGroupData;
    private loadItemsData;
}
declare let app: AppController;
