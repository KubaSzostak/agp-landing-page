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
export declare type ItemType = "Web Map" | "CityEngine Web Scene" | "Web Scene" | "360 VR Experience" | "Pro Map" | "Map Area" | "Feature Service" | "Map Service" | "Image Service" | "KML" | "KML Collection" | "WMS" | "WFS" | "WMTS" | "Feature Collection" | "Feature Collection Template" | "Geodata Service" | "Globe Service" | "Vector Tile Service" | "Scene Service" | "Relational Database Connection" | "Oriented Imagery Catalog" | "Geometry Service" | "Geocoding Service" | "Network Analysis Service" | "Geoprocessing Service" | "Workflow Manager Service" | "Web Mapping Application" | "Dashboard";
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
    itemUrl: string;
    thumbnailUrl: string;
}
export interface ItemsJson {
    items: ItemJson[];
}
export declare function fetchApiJson(portalUrl: string, apiUrl: string): Promise<any>;
export declare function fetchPortal(portalUrl: string): Promise<any>;
export declare function fetchGroups(portalUrl: string): Promise<any>;
export declare function fetchGroupItems(portalUrl: string, group: GroupJson): Promise<any>;
