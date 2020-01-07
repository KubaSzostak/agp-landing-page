
export interface RestApiJson {
    error: {
        message: string;
        details: string;
    }
}


/** https://developers.arcgis.com/rest/users-groups-and-items/portal-self.htm */
export interface PortalJson extends RestApiJson {

    /** The organization's name, eg. 'MyOrg GIS Portal*/
    name: string; 

    /** The portal's name: "ArcGIS Online" | "ArcGIS Enterprise" */
    portalName: string; 

    /** The URL to the thumbnail of the portal. */
    portalThumbnail: string;

    /** The URL to the thumbnail of the organization. */
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



export type ItemActionType = "info" | "external" | "download";

export interface ItemJson {
    id: string;
    title: string; // World Reference Overlay
    name: string; // World_Reference_Overlay
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
    accessInformation: string; //<credits>,
    licenseInfo: string; // "<access and use constraints>"
    culture: string; //"<culture code>",
    access: "private | shared | org | public";
    size: number;
    numComments: number;
    numRatings: number;
    avgRating: number;
    numViews: number;
    scoreCompleteness: number;
    groupCategories: string[];
      
    // extensions
    actionUrl: string;
    actionType: ItemActionType;
    infoUrl: string;
    thumbnailUrl: string;
}

export interface ItemsJson {
    items: ItemJson[];
}

interface PortalInfo {
    portalUrl: string;
    group: string;
}

let suggestedPortalList: PortalInfo[] = [
    { portalUrl: "https://www.arcgis.com",  group: "908dd46e749d4565a17d2b646ace7b1a"  },
    { portalUrl: "http://www.arcgis.com",  group: "908dd46e749d4565a17d2b646ace7b1a"  }, // http
    { portalUrl: "https://mapy.umgdy.gov.pl/pzp",  group: "bec4867931504e4897aa927629c5e03f"  },
    { portalUrl: "https://mapy.umgdy.gov.pl/portal", group: "9227744bd89342429da120fb3bba224a" }
];






export class Portal {

    constructor(public portalUrl?: string, public groupId?: string) {  
        // Initialize config with default values if needed
        this.portalUrl = this.suggestPortalUrl(portalUrl);
        if (this.portalUrl.lastIndexOf("/") != portalUrl.length -1){
            this.portalUrl = this.portalUrl + "/";
        }
        this.groupId = this.suggestGroupId(groupId);
    }

    private suggestPortalUrl(portalUrl?: string): string {
        if (portalUrl && portalUrl.length > 0) {
            return portalUrl;
        }
    
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("portalUrl")) {
            return urlParams.get("portalUrl");
        }                  
        
        for (const portal of suggestedPortalList) {
            if (window.location.href.indexOf(portal.portalUrl) === 0) {
                return portal.portalUrl;
            }        
        }
        console.log("Default ArcGIS Portal url is set: ", suggestedPortalList[0].portalUrl);
        return suggestedPortalList[0].portalUrl; // Set first item as default
    
        // https://portal.myorg.com:7443/arcgis/home     (Direct URL)
        // https://maps.myorg.com/portal/home            (Web Adaptor URL)
        /*
        arcgisPortalLandingPageConfig.portalUrl = 
            window.location.origin +  "/" +             // https://portal.myorg.org:7443  |  https://maps.myorg.com
            window.location.pathname.split("/")[1];     // /arcgis/home                   |  /portal/home 
        */
    }

    private suggestGroupId(groupId: string) {
        if (groupId && groupId.length > 0) {
            return groupId;
        }

        const urlParams = new URLSearchParams(window.location.search);
        let urlGroupId = urlParams.get("group") || urlParams.get("groupId");
        if (urlGroupId) {
            return urlGroupId;
        }        

        for (const portal of suggestedPortalList) {
            if (this.portalUrl.indexOf(portal.portalUrl) === 0) {
                console.log("Default ArcGIS Portal group is set: " + this.groupId);
                return portal.group;
            }        
        }
        return undefined;
    }
    

    public fetchApiJson(apiUrl: string): Promise<any> {
        //url = url + "?f=json";
        let url = this.portalUrl + "sharing/rest/" + apiUrl;
        return fetch(url)
        .then((resp) => {
            //console.log("fetch success", resp);
            if (!resp.ok) {
                console.warn("Fetching ERROR: " + url);
                console.warn("HTTP response error", resp);
                throw new Error('HTTP error, status = ' + resp.status);
            }
            return resp.json();
        })
        .then((json: RestApiJson) => {
            if (json.error) {
                console.warn("Fetching ArcGIS Portal Rest API response errror: " + json.error.message);
                console.warn(url);
                throw new Error("Fetching ArcGIS Portal Rest API response errror: " + json.error.message);
            }
            return json;
        })        
        .catch((reason) => {
            console.warn("fetch error", reason);
            throw reason;
        });
    }


    public fetchPortal(): Promise<PortalJson> {
        return this.fetchApiJson("portals/self?f=json")
        .then((portal: PortalJson) => {
            if (portal.thumbnail) {
                portal.thumbnailUrl = this.portalUrl + "sharing/rest/portals/self/resources/" + portal.thumbnail; //thumbnail.png
            }
            else if (portal.portalThumbnail) {
                portal.thumbnailUrl = this.portalUrl + "sharing/rest/portals/self/resources/" + portal.portalThumbnail; //thumbnail.png
            }
            portal.portalUrl = this.portalUrl;
            return portal;
        })
        .catch((reason)=> {
            throw new Error("Failed to load Portal info " + this.portalUrl);
        });
    }


    public fetchGroup(groupId?: string): Promise<GroupJson> {   
        if (!groupId) {
            groupId = this.groupId;
        }
        return this.fetchApiJson("community/groups/" + groupId + "?f=json")
        .then((group: GroupJson)=> {
            // https://www.arcgis.com/sharing/rest/community/groups/a9dd8d5f05b5479f8c4875de746d4cda/info/Esri_Logo_13.jpg?token=
            if (group.thumbnail) {
                group.thumbnailUrl = this.portalUrl + "sharing/rest/community/groups/" + groupId + "/info/" + group.thumbnail;
            }
            group.groupUrl = this.portalUrl + "home/group.html?id=" + groupId;
            return group;
        })
        .catch((reason)=> {
            throw new Error("Failed to load Group info " + this.portalUrl + "home/group.html?id=" + this.groupId);
        });
    }


    public fetchGroupItems(group: GroupJson, start: number = 1, num: number = 16): Promise<GroupSearchJson> {        
        // /content/items/<itemId>
        return this.fetchApiJson("search?f=json" 
            + "&q=group%3A" + group.id 
            + "&start=" + start
            + "&num=" + num 
            + "&sortField=" + group.sortField 
            + "&sortOrder=" + group.sortOrder)
        .then((searchResult: GroupSearchJson) => {
            for (const item of searchResult.results) {
                this.initItemData(item);
            }
            return searchResult;
        })
        .catch((reason)=> {
            throw new Error("Failed to load Group items " + this.portalUrl + "home/group.html?id=" + group.id);
        });
    }

    private initItemData(item: ItemJson) {
        if (item.thumbnail) {
            // Item thumbnail can be retrieved at different dimensions with specifying a URL parameter w for the desired image width 
            // (i.e. https://<item-url>/info/thumbnail/thumbnail.png?w=400). Supported retrievable thumbnail widths for item are:
            // 200 pixels (default), 400 pixels, 800 pixels and 2400 pixels.
            // Other specified size will be snapped to the next highest supported dimension for query. 
            // If the original image dimension is smaller than the size queried, the original image will 
            // be returned (with an aspect ratio of 1.5:1). 
            item.thumbnailUrl = this.portalUrl + "sharing/rest/content/items/" + item.id + "/info/" + item.thumbnail + "?w=800";            
        }
        
        console.log(item.name);
        console.log(item.title);
        console.log(item.type);
        //Item action
        item.actionType = "external";
        item.infoUrl = this.portalUrl + "home/item.html?id=" + item.id;
        if (item.type == "Web Map") {
            item.actionUrl = this.portalUrl + "home/webmap/viewer.html?webmap=" + item.id;
        }
        else if ((item.type == "Dashboard")) {
            item.actionUrl = this.portalUrl + "apps/opsdashboard/index.html#/" + item.id;
        }
        else if (item.type == "Code Attachment") {

        }
        else if (item.url && (itemDataFormats.url.indexOf(item.type) > -1)) {
            item.actionUrl = item.url;
        }
        else if (itemDataFormats.file.indexOf(item.type) > -1) {
            item.actionUrl = this.portalUrl + "sharing/rest/content/items/" + item.id + "/data";
            item.actionType = "download";        
        }
        else {
            item.actionUrl = item.infoUrl;
            item.actionType = "info";
            console.log("Default item action used.", "item.name:", item.name, "item.type:", item.type, "actionUrl:", item.actionUrl);
        }
    }
}



/** https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm */
export type ItemType = 
    // Maps
    "Web Map" | "CityEngine Web Scene" | "Web Scene" | "360 VR Experience" | "Pro Map" | "Map Area" |
    // Layers
    "Feature Service" | "Map Service" | "Image Service" | "KML" | "KML Collection" | "WMS" | "WFS" | "WMTS" | 
    "Feature Collection" | "Feature Collection Template" | "Geodata Service" | "Globe Service" | "Vector Tile Service" |
    "Scene Service" | "Relational Database Connection" | "Oriented Imagery Catalog" |
    // Tools
    "Geometry Service" | "Geocoding Service" | "Network Analysis Service" | "Geoprocessing Service" | "Workflow Manager Service" |
    // Applications
    "Web Mapping Application" | "Mobile Application" | "Code Attachment" | 
    "Operations Dashboard Add In" | "Operation View" | "Operations Dashboard Extension" | 
    "Native Application" | "Native Application Template" | "Native Application Installer" | 
    "Workforce Project" | "Form" | 
    "Insights Workbook" | "Insights Model" | "Insights Page" | "Insights Theme" | "Dashboard" | 
    "Hub Initiative" | "Hub Site Application" | "Hub Page" | "AppBuilder Extension" | "AppBuilder Widget Package" | 
    "Ortho Mapping Project" | "Ortho Mapping Template" | "Solution" | "Excalibur Imagery Project" | "StoryMap" | "Web Experience" |
    // Data Files
    "Symbol Set" | "Color Set" | "Shapefile" | "File Geodatabase" | "CSV" | "CAD Drawing" | "Service Definition" | "Document Link" | 
    "Microsoft Word" | "Microsoft Powerpoint" | "Microsoft Excel" | "PDF" | "Image" | "Visio Document" | 
    "iWork Keynote" | "iWork Pages" | "iWork Numbers" | 
    "Report Template" | "Statistical Data Collection" | "SQLite Geodatabase" | "Content Category Set" | "GeoPackage" |
    // ***
    // Desktop Maps
    "Map Document" | "Map Package" | "Mobile Basemap Package" | "Mobile Map Package" | 
    "Tile Package" | "Compact Tile Package" | "Vector Tile Package" | 
    "Project Package" | "Task File" | "ArcPad Package" | "Explorer Map" | "Globe Document" | "Scene Document" | 
    "Published Map" | "Map Template" | "Windows Mobile Package" | "Pro Map" | "Layout" | "Project Template" | "Mobile Scene Package" |
    // Desktop Layers
    "Layer" | "Layer Package" | "Explorer Layer" | "Scene Package" | "Image Collection" | "Pro Report" |
    // Destkotp Styles
    "Desktop Style" |
    // Desktop Tools
    "Geoprocessing Package" | "Geoprocessing Package (Pro version)" | "Geoprocessing Sample" | 
    "Locator Package" | "Rule Package" | "Raster function template" | "ArcGIS Pro Configuration" | "Deep Learning Package" |
    // Dekstop Applications
    "Workflow Manager Package" | "Desktop Application" | "Desktop Application Template" | "Code Sample" | 
    "Desktop Add In" | "Explorer Add In" | "ArcGIS Pro Add In";


interface ItemDataFormats {
    textJson: Array<ItemType>;
    file: Array<ItemType>;
    url: Array<ItemType>;
}

/** https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm */
let itemDataFormats: ItemDataFormats = {
    textJson: [
        "Web Map", "Web Scene", "360 VR Experience", "Map Area", "Feature Service",
        "Map Service", "Image Service", "WFS", "WMTS", "Feature Collection", "Feature Collection Template",
        "Vector Tile Service", "Scene Service", "Relational Database Connection", "Oriented Imagery Catalog", 
        "Mobile Application", "Workforce Project", "Insights Workbook", "Insights Model",
        "Insights Page", "Insights Theme", "Dashboard", "Hub Initiative", "Hub Site Application", "Hub Page",
        "Ortho Mapping Project", "Ortho Mapping Template", "Solution", "Excalibur Imagery Project", "StoryMap", 
        "Web Experience", "Symbol Set", "Color Set", "Content Category Set"
    ],
    file: [
        "CityEngine Web Scene", "Pro Map", "KML", "KML Collection", "Code Attachment",
        "Operations Dashboard Add In", "Native Application", "Native Application Template", "Native Application Installer",
        "Form", "AppBuilder Widget Package", "Shapefile", "File Geodatabase", "CSV", "CAD Drawing", "Service Definition", 
        "Microsoft Word", "Microsoft Powerpoint", "Microsoft Excel", "PDF", "Image", "Visio Document", 
        "iWork Keynote", "iWork Pages", "iWork Numbers", "Report Template", "Statistical Data Collection", 
        "SQLite Geodatabase", "GeoPackage", "Map Document", "Map Package", "Mobile Basemap Package", "Mobile Map Package", 
        "Tile Package", "Compact Tile Package", "Vector Tile Package","Project Package", "Task File", "Published Map",
        "Map Template", "Windows Mobile Package", "Pro Map", "Layout", "Project Template", "Mobile Scene Package",
        "Layer", "Layer Package", "Explorer Layer", "Scene Package", "Image Collection", "Pro Report",
        "Desktop Style", "Geoprocessing Package", "Geoprocessing Package (Pro version)", "Geoprocessing Sample", 
        "Locator Package", "Rule Package", "Raster function template", "ArcGIS Pro Configuration", "Deep Learning Package",
        "Workflow Manager Package", "Desktop Application", "Desktop Application Template", "Code Sample",
        "Desktop Add In", "Explorer Add In", "ArcGIS Pro Add In", "Operation View"
    ],
    url: [
        "Web Mapping Application", "WMS", "Geodata Service", "Globe Service", "Geometry Service", "Geocoding Service",
        "Network Analysis Service", "Geoprocessing Service", "Workflow Manager Service", "Operations Dashboard Extension",
        "AppBuilder Extension", "Document Link"
    ]
}