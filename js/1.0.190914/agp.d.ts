export interface RestApiJson {
    error: {
        message: string;
        details: string;
    };
}
export interface PortalJson extends RestApiJson {
    name: string;
    portalName: string;
    portalThumbnail: string;
    thumbnail: string;
    currentVersion: number;
    portalUrl: string;
    thumbnailUrl: string;
}
export interface GroupJson extends RestApiJson {
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
export interface GroupSearchJson extends RestApiJson {
    start: number;
    num: number;
    nextStart: number;
    total: number;
    query: string;
    results: ItemJson[];
}
export declare type ItemActionType = "info" | "external" | "download";
export interface ItemJson {
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
    actionUrl: string;
    actionType: ItemActionType;
    infoUrl: string;
    thumbnailUrl: string;
}
export interface ItemsJson {
    items: ItemJson[];
}
export declare class Portal {
    portalUrl?: string;
    groupId?: string;
    constructor(portalUrl?: string, groupId?: string);
    private suggestPortalUrl;
    private suggestGroupId;
    fetchApiJson(apiUrl: string): Promise<any>;
    fetchPortal(): Promise<PortalJson>;
    fetchGroup(groupId?: string): Promise<GroupJson>;
    fetchGroupItems(group: GroupJson, start?: number, num?: number): Promise<GroupSearchJson>;
    private initItemData;
}
export declare type ItemType = "Web Map" | "CityEngine Web Scene" | "Web Scene" | "360 VR Experience" | "Pro Map" | "Map Area" | "Feature Service" | "Map Service" | "Image Service" | "KML" | "KML Collection" | "WMS" | "WFS" | "WMTS" | "Feature Collection" | "Feature Collection Template" | "Geodata Service" | "Globe Service" | "Vector Tile Service" | "Scene Service" | "Relational Database Connection" | "Oriented Imagery Catalog" | "Geometry Service" | "Geocoding Service" | "Network Analysis Service" | "Geoprocessing Service" | "Workflow Manager Service" | "Web Mapping Application" | "Mobile Application" | "Code Attachment" | "Operations Dashboard Add In" | "Operation View" | "Operations Dashboard Extension" | "Native Application" | "Native Application Template" | "Native Application Installer" | "Workforce Project" | "Form" | "Insights Workbook" | "Insights Model" | "Insights Page" | "Insights Theme" | "Dashboard" | "Hub Initiative" | "Hub Site Application" | "Hub Page" | "AppBuilder Extension" | "AppBuilder Widget Package" | "Ortho Mapping Project" | "Ortho Mapping Template" | "Solution" | "Excalibur Imagery Project" | "StoryMap" | "Web Experience" | "Symbol Set" | "Color Set" | "Shapefile" | "File Geodatabase" | "CSV" | "CAD Drawing" | "Service Definition" | "Document Link" | "Microsoft Word" | "Microsoft Powerpoint" | "Microsoft Excel" | "PDF" | "Image" | "Visio Document" | "iWork Keynote" | "iWork Pages" | "iWork Numbers" | "Report Template" | "Statistical Data Collection" | "SQLite Geodatabase" | "Content Category Set" | "GeoPackage" | "Map Document" | "Map Package" | "Mobile Basemap Package" | "Mobile Map Package" | "Tile Package" | "Compact Tile Package" | "Vector Tile Package" | "Project Package" | "Task File" | "ArcPad Package" | "Explorer Map" | "Globe Document" | "Scene Document" | "Published Map" | "Map Template" | "Windows Mobile Package" | "Pro Map" | "Layout" | "Project Template" | "Mobile Scene Package" | "Layer" | "Layer Package" | "Explorer Layer" | "Scene Package" | "Image Collection" | "Pro Report" | "Desktop Style" | "Geoprocessing Package" | "Geoprocessing Package (Pro version)" | "Geoprocessing Sample" | "Locator Package" | "Rule Package" | "Raster function template" | "ArcGIS Pro Configuration" | "Deep Learning Package" | "Workflow Manager Package" | "Desktop Application" | "Desktop Application Template" | "Code Sample" | "Desktop Add In" | "Explorer Add In" | "ArcGIS Pro Add In";
