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
export declare type ItemType = "Web Map" | "CityEngine Web Scene" | "Web Scene" | "360 VR Experience" | "Pro Map" | "Map Area" | "Feature Service" | "Map Service" | "Image Service" | "KML" | "KML Collection" | "WMS" | "WFS" | "WMTS" | "Feature Collection" | "Feature Collection Template" | "Geodata Service" | "Globe Service" | "Vector Tile Service" | "Scene Service" | "Relational Database Connection" | "Oriented Imagery Catalog" | "Geometry Service" | "Geocoding Service" | "Network Analysis Service" | "Geoprocessing Service" | "Workflow Manager Service" | "Web Mapping Application" | "Dashboard";
