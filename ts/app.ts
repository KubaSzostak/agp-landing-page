
import * as agp from "./agp.js";


interface ItemAction {
    url: string;
    iconSvg: string;
    isItemInfo?: boolean;
}

let isDebugDebugMode = window.location.href.indexOf("/localhost") > 0;


class AppIcons {

    /** https://feathericons.com */
    private static featherIcon(path: string, size: number = 24){
        return `<svg xmlns="http://www.w3.org/2000/svg" width="` + size + `" height="` + size + `" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="align-top mr-2">` + path + `</svg>`;
    }
    public static info(size?: number) {
        return AppIcons.featherIcon(`<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>`, size);
    }
    public static externalLink(size?: number) {
        return AppIcons.featherIcon (`<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>`, size);
    }
    public static download(size?: number) {
        return AppIcons.featherIcon (`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>`, size);
    }
    public static search(size?: number) {
        return AppIcons.featherIcon (`<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>`, size);
    }
    public static home(size?: number) {
        return AppIcons.featherIcon (`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`, size);
    }
    public static list(size?: number) {
        return AppIcons.featherIcon (`<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line>`, size);
    } 
    public static chevronsDown(size?: number) {
        return AppIcons.featherIcon (`<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>`, size);
    } 
    public static map(size?: number) {
        return AppIcons.featherIcon (`<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>`, size);
    } 


    /** https://useiconic.com/open */
    private static iconicIcon(path: string, size: number = 24) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="` + size + `" height="` + size + `" viewBox="0 0 8 8"  class="align-top mr-2">` + path + `</svg>`;
    }
    public static listRich(size?: number) {
        return AppIcons.iconicIcon(`<path d="M0 0v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3zm-4 2v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3z" />`, size); 
    }

    public static itemAction(action: agp.ItemActionType) {
        if (action == "info") {
            return this.info();
        }
        if (action == "download") {
            return this.download();
        }
        if (action == "external") {
            return this.externalLink();
        }
        return this.externalLink();
    }
    
    // https://github.com/danklammer/bytesize-icons
}




export class AppView {

    private navbarTitleContainer = document.getElementById("navbarTitleContainer") as HTMLAnchorElement;    
    private searchBoxElement = document.getElementById("searchBoxElement");
    private searchButtonElement = document.getElementById("searchButtonElement");

    private groupInfoContainer = document.getElementById("groupInfoContainer") ;
    private groupItemsContainer = document.getElementById("groupItemsContainer");
    private loadMoreItemsButton = document.getElementById("loadMoreItemsButton") as HTMLButtonElement;
    private loadMoreItemsProgress = document.getElementById("loadMoreItemsProgress");

    private portalDeltailsFooter = document.getElementById("portalDeltailsFooter");
    private groupDetailsFooter = document.getElementById("groupDetailsFooter");

    private splashScreenModal = document.getElementById("splashScreenModal");
    private splashScreenBackdrop = document.getElementById("splashScreenBackdrop");
    private portal: agp.Portal;
    private group: agp.GroupJson;
    


    constructor(portalUrl: string, groupId: string) {  
        this.portal = new agp.Portal(portalUrl, groupId);
        if (!this.portal.groupId) {
            this.showError("Unable to load group items: ArcGIS Portal group is not set.");
        }

        this.loadMoreItemsButton.addEventListener("click", ()=> {
            this.appendMoreItems();
        });
    }

    public loadAppData(): Promise<any> {
        if (isDebugDebugMode) {
            console.log("Loading ArcGIS Portal data", this.portal.portalUrl, this.portal.groupId);
        }

        return Promise.all([
            this.portal.fetchPortal().then((portal: agp.PortalJson) => {
                this.setPortalData(portal);
            }), 
            this.portal.fetchGroup().then((group: agp.GroupJson)=> {
                this.setGroupData(group);
                return this.portal.fetchGroupItems(group).then((items: agp.GroupSearchJson)=> {
                    this.appendItems(items);
                });  
            }),
        ])
        .then(()=> {
            this.hideSplashScreen();
        })
        .catch((reason) => {
            console.warn("App loading error: ", reason);
            this.showError(reason);
            return reason;
        });
    }

    public hideSplashScreen() {
        this.splashScreenModal.classList.remove("show");
        this.splashScreenBackdrop.classList.remove("show");
        setTimeout(() => {
            this.splashScreenModal.style.display = "none";
            this.splashScreenBackdrop.style.display = "none";
        }, 300);
    }

    public showError (err: any) {
        this.splashScreenModal.classList.add("text-danger");
        (this.splashScreenModal.getElementsByClassName("modal-header").item(0) as HTMLElement).style.display = "";        
        this.splashScreenModal.getElementsByClassName("modal-title").item(0).innerHTML = "Error";
        this.splashScreenModal.getElementsByClassName("modal-body").item(0).innerHTML = err.message || err;
    }

    private setFooterContainerAnchor(container: HTMLElement, text: string, url: string, thumbnailUrl: string, iconSvg: string) {        
        container.innerHTML = "";

        let anchor = this.appendAnchor(container, null, iconSvg, url); // innerHTML has only default iconSvg
        //if (thumbnailUrl) {
        //    anchor.innerHTML = `<img src="` + thumbnailUrl + `" width="24" height="24" class="align-top mr-2 mb-2" alt="">`;
        //}
        anchor.innerHTML = anchor.innerHTML + text;
    }

    private supportedPortalVersion = 5.3;
    public setPortalData(portal: agp.PortalJson) {
        if (isDebugDebugMode) {
            console.log("portal: ", portal);
        }
        if (portal.currentVersion < this.supportedPortalVersion) {
            console.log("This app was tested with ArcGIS Portal " + this.supportedPortalVersion + " version. Your version of ArcGIS Portal (" + portal.currentVersion + ") may not function properly.");
        }
        else {
            console.log("ArcGIS Portal version: ", portal.currentVersion);            
        }
        let portalName = portal.name || portal.portalName;
        this.setFooterContainerAnchor(this.portalDeltailsFooter, portalName, portal.portalUrl, portal.thumbnailUrl, AppIcons.home());
    }

    public setGroupData(group: agp.GroupJson) {
        if (isDebugDebugMode) {
            console.log("group: ", group);
        }

        this.group = group;
        document.title = group.title;

        this.navbarTitleContainer.innerHTML = "";
        this.navbarTitleContainer.href = window.location.href;
        if (group.thumbnailUrl) {
            this.navbarTitleContainer.innerHTML = this.navbarTitleContainer.innerHTML + `
            <img src="` + group.thumbnailUrl + `" width="30" height="30" class="d-inline-block align-top" alt="">&nbsp;`;

            let headIcon = document.createElement("link");
            headIcon.href = group.thumbnailUrl;
            headIcon.id = "favicon";
            headIcon.rel = "shortcut icon";
            document.head.appendChild(headIcon);
        }
        this.navbarTitleContainer.innerHTML = this.navbarTitleContainer.innerHTML + group.title;

        this.groupInfoContainer.innerHTML = `<h1 class="display-4 text-center">` + group.title + `</h1>`
        if (group.snippet) {
            this.groupInfoContainer.innerHTML = this.groupInfoContainer.innerHTML + `
            <p class="lead text-center">` + group.snippet + `</p>`;
        }
        if (group.description) {
            this.groupInfoContainer.innerHTML = this.groupInfoContainer.innerHTML + `
            <p class="text-justify">` + group.description + `</p>`;
        }        
        this.makeImagesResponsive(this.groupInfoContainer);

        this.setFooterContainerAnchor(this.groupDetailsFooter, group.title, group.groupUrl, group.thumbnailUrl, AppIcons.list());
    }

    /** Make images responsive (not to extend page width) */
    private makeImagesResponsive(container: HTMLElement) {
        let images = container.getElementsByTagName("img");
        for (let i = 0; i < images.length; ++i) {
            let img = images[i];
            img.classList.add("img-fluid")
         }
    }

    private lastSearchResult: agp.GroupSearchJson;

    public appendItems(searchResult: agp.GroupSearchJson) {
        if (isDebugDebugMode) {
            console.log("items: ", searchResult);
        }
        if (searchResult.start == 1) {
            this.groupItemsContainer.innerHTML = "";           
        }
        if ((searchResult.nextStart < 1) || (searchResult.nextStart > searchResult.total)) {
            this.loadMoreItemsButton.style.display = "none";
        }
        else {
            this.loadMoreItemsButton.style.display = ""; 
        }
        this.loadMoreItemsProgress.style.display = "none";

        this.lastSearchResult = searchResult;
        for (const item of searchResult.results) {
            this.appendItemData(item);
        }
        this.loadMoreItemsButton.title = (searchResult.nextStart - 1) + "/" + searchResult.total;
    }

    private appendItemData(item: agp.ItemJson) {
        let itemCard = this.appendDiv(this.groupItemsContainer, "card mb-4 shadow");
        let itemRow = this.appendDiv(itemCard, "row  no-gutters");

        let itemImgAnchor = this.appendAnchor(itemRow, "col-sm-4", "", item.actionUrl);
        let itemImg = this.appendImg(itemImgAnchor);  
        itemImg.src = item.thumbnailUrl || "img/item.png";            
        itemImg.alt = item.type;

        if (item.snippet && ! item.description) {
            // If there is no description display snippet in multi-line mode
            item.description = item.snippet;
            item.snippet = "";
        }

        let itemBody = this.appendDiv(itemRow, "col-sm-8 card-body d-flex flex-column");
        let itemTitleAnchor = this.appendAnchor(itemBody, null, null, item.actionUrl);
        this.appendElement(itemTitleAnchor, "h5", "card-title", item.title).title = item.title;
        if (item.snippet) {
            this.appendElement(itemBody, "h6", "card-subtitle mb-2 text-muted", item.snippet).title = item.snippet;
        }
        if (item.description) {
            this.appendElement(itemBody, "p", "card-text", item.description);
        }
        let itemLinks = this.appendDiv(itemBody, "mt-auto");
        if (item.actionType != "info" ) {
            this.appendAnchor(itemLinks, "card-link", AppIcons.info(), item.infoUrl);
        }
        this.appendAnchor(itemLinks, "card-link", AppIcons.itemAction(item.actionType), item.actionUrl);
    } 

    private appendMoreItems() {      
        this.loadMoreItemsButton.style.display = "none";
        this.loadMoreItemsProgress.style.display = "";

        // group %3A bec4867931504e4897aa927629c5e03f
        return this.portal.fetchGroupItems(this.group, this.lastSearchResult.nextStart)
        .then((items: agp.GroupSearchJson)=> {
            this.appendItems(items);
        })
        .catch((reason)=> {
            this.loadMoreItemsButton.style.display = "none";
            this.loadMoreItemsProgress.style.display = "";
            this.loadMoreItemsProgress.style.width = "";
            this.loadMoreItemsProgress.className = "alert alert-danger";
            this.loadMoreItemsProgress.innerHTML = "Failed to load Group items " + this.portal.portalUrl + "home/group.html?id=" + this.group.id;
            console.warn(this.loadMoreItemsButton.innerHTML);
            console.warn(reason);
        });
    }


    private appendElement(owner: HTMLElement, tag: string,  className: string, html: string) {
        let e = document.createElement(tag);
        if (className) {
            e.className = className;
        }
        if (html) {
            e.innerHTML = html;
        }
        owner.appendChild(e);
        return e;
    }
    private appendDiv(owner: HTMLElement, className?: string) {
        return this.appendElement(owner, "div", className, undefined);
    }
    private appendImg(owner: HTMLElement, className?: string) {
        return this.appendElement(owner, "img", className, undefined) as HTMLImageElement;
    }
    private appendAnchor(owner: HTMLElement, className: string, html: string, url: string) {
        let a =  this.appendElement(owner, "a", className, html) as HTMLAnchorElement;
        a.target = "_blank";
        a.href = url;
        return a;
    }    

}



