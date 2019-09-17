"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agp = require("./agp");
if (!agpLandingPageConfig) {
    agpLandingPageConfig = {};
}
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("group")) {
    agpLandingPageConfig.group = urlParams.get("group");
}
if (urlParams.get("portalUrl")) {
    agpLandingPageConfig.portalUrl = urlParams.get("portalUrl");
}
let arcgisPortalList = [
    { portalUrl: "https://www.arcgis.com", group: "908dd46e749d4565a17d2b646ace7b1a" },
    { portalUrl: "http://www.arcgis.com", group: "908dd46e749d4565a17d2b646ace7b1a" },
    { portalUrl: "https://mapy.umgdy.gov.pl/pzp", group: "bec4867931504e4897aa927629c5e03f" },
    { portalUrl: "https://mapy.umgdy.gov.pl/portal", group: "9227744bd89342429da120fb3bba224a" }
];
if (!agpLandingPageConfig.portalUrl) {
    for (const portal of arcgisPortalList) {
        if (window.location.href.indexOf(portal.portalUrl) === 0) {
            agpLandingPageConfig.portalUrl = portal.portalUrl;
        }
    }
    if (!agpLandingPageConfig.portalUrl) {
        agpLandingPageConfig.portalUrl = arcgisPortalList[0].portalUrl;
    }
    console.log("Default ArcGIS Portal url is set: ", agpLandingPageConfig.portalUrl);
}
if (!agpLandingPageConfig.group) {
    let portalUrl = agpLandingPageConfig.portalUrl;
    for (const portal of arcgisPortalList) {
        if (portalUrl.indexOf(portal.portalUrl) === 0) {
            agpLandingPageConfig.group = portal.group;
        }
    }
    if (agpLandingPageConfig.group) {
        console.log("Default ArcGIS Portal group is set: " + agpLandingPageConfig.group);
    }
    else {
        console.error("Unable to load group items: ArcGIS Portal group is not set.");
    }
}
let isDebugDebugMode = window.location.href.indexOf("/localhost") > 0;
class AppIcons {
    static featherIcon(path, size = 24) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="` + size + `" height="` + size + `" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="align-top mr-2">` + path + `</svg>`;
    }
    static info(size) {
        return AppIcons.featherIcon(`<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>`, size);
    }
    static externalLink(size) {
        return AppIcons.featherIcon(`<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>`, size);
    }
    static download(size) {
        return AppIcons.featherIcon(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>`, size);
    }
    static search(size) {
        return AppIcons.featherIcon(`<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>`, size);
    }
    static home(size) {
        return AppIcons.featherIcon(`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`, size);
    }
    static list(size) {
        return AppIcons.featherIcon(`<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line>`, size);
    }
    static chevronsDown(size) {
        return AppIcons.featherIcon(`<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>`, size);
    }
    static map(size) {
        return AppIcons.featherIcon(`<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>`, size);
    }
    static iconicIcon(path, size = 24) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="` + size + `" height="` + size + `" viewBox="0 0 8 8"  class="align-top mr-2">` + path + `</svg>`;
    }
    static listRich(size) {
        return AppIcons.iconicIcon(`<path d="M0 0v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3zm-4 2v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3z" />`, size);
    }
}
class AppView {
    constructor(portalUrl, groupId) {
        this.portalUrl = portalUrl;
        this.groupId = groupId;
        this.navbarTitleContainer = document.getElementById("navbarTitleContainer");
        this.searchBoxElement = document.getElementById("searchBoxElement");
        this.searchButtonElement = document.getElementById("searchButtonElement");
        this.groupHeadingContainer = document.getElementById("groupHeadingContainer");
        this.groupItemsContainer = document.getElementById("groupItemsContainer");
        this.loadMoreItemsButton = document.getElementById("loadMoreItemsButton");
        this.loadMoreItemsProgress = document.getElementById("loadMoreItemsProgress");
        this.portalDeltailsContainer = document.getElementById("portalDeltailsContainer");
        this.groupDetailsContainer = document.getElementById("groupDetailsContainer");
        this.splashScreenModal = document.getElementById("splashScreenModal");
        this.splashScreenBackdrop = document.getElementById("splashScreenBackdrop");
        this.supportedPortalVersion = 5.3;
        this.loadMoreItemsButton.addEventListener("click", () => {
            this.appendMoreItems();
        });
    }
    loadAppData() {
        return Promise.all([
            agp.fetchPortal(this.portalUrl).then((portal) => {
                this.setPortalData(portal);
            }),
            agp.fetchGroups(this.portalUrl).then((group) => {
                this.setGroupData(group);
                agp.fetchGroupItems(this.portalUrl, group);
                return group;
            })
        ])
            .then(() => {
            this.hideSplashScreen();
        })
            .catch((reason) => {
            console.warn("App loading error: ", reason);
            this.showError(reason);
            return reason;
        });
    }
    hideSplashScreen() {
        this.splashScreenModal.classList.remove("show");
        this.splashScreenBackdrop.classList.remove("show");
        setTimeout(() => {
            this.splashScreenModal.style.display = "none";
            this.splashScreenBackdrop.style.display = "none";
        }, 300);
    }
    showError(err) {
        this.splashScreenModal.classList.add("text-danger");
        this.splashScreenModal.getElementsByClassName("modal-header").item(0).style.display = "";
        this.splashScreenModal.getElementsByClassName("modal-title").item(0).innerHTML = "Error";
        this.splashScreenModal.getElementsByClassName("modal-body").item(0).innerHTML = err.message || err;
    }
    setFooterContainerAnchor(container, text, url, thumbnailUrl, iconSvg) {
        container.innerHTML = "";
        let anchor = this.appendAnchor(container, null, iconSvg, url);
        anchor.innerHTML = anchor.innerHTML + text;
    }
    setPortalData(portal) {
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
        this.setFooterContainerAnchor(this.portalDeltailsContainer, portalName, portal.portalUrl, portal.thumbnailUrl, AppIcons.home());
    }
    setGroupData(group) {
        if (isDebugDebugMode) {
            console.log("group: ", group);
        }
        document.title = group.title;
        this.navbarTitleContainer.innerHTML = "";
        this.navbarTitleContainer.href = window.location.href;
        if (group.thumbnail) {
            this.navbarTitleContainer.innerHTML = this.navbarTitleContainer.innerHTML + `
            <img src="` + group.thumbnailUrl + `" width="30" height="30" class="d-inline-block align-top" alt="">&nbsp;`;
            let headIcon = document.createElement("link");
            headIcon.href = group.thumbnailUrl;
            headIcon.id = "favicon";
            headIcon.rel = "shortcut icon";
            document.head.appendChild(headIcon);
        }
        this.navbarTitleContainer.innerHTML = this.navbarTitleContainer.innerHTML + group.title;
        this.groupHeadingContainer.innerHTML = `<h1 class="display-4 text-center">` + group.title + `</h1>`;
        if (group.snippet) {
            this.groupHeadingContainer.innerHTML = this.groupHeadingContainer.innerHTML + `
            <p class="lead text-center">` + group.snippet + `</p>`;
        }
        if (group.description) {
            this.groupHeadingContainer.innerHTML = this.groupHeadingContainer.innerHTML + `
            <p class="text-justify">` + group.description + `</p>`;
        }
        this.setFooterContainerAnchor(this.groupDetailsContainer, group.title, group.groupUrl, group.thumbnailUrl, AppIcons.list());
    }
    appendItems(searchResult) {
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
    appendItemData(item) {
        let itemAction = this.getItemAction(item);
        let itemCard = this.appendDiv(this.groupItemsContainer, "card mb-4 shadow");
        let itemRow = this.appendDiv(itemCard, "row  no-gutters");
        let itemImgAnchor = this.appendAnchor(itemRow, "col-sm-4", "", itemAction.url);
        let itemImg = this.appendImg(itemImgAnchor);
        if (item.thumbnail) {
            itemImg.src = this.portalUrl + "sharing/rest/content/items/" + item.id + "/info/" + item.thumbnail;
        }
        else {
            itemImg.src = "img/item.png";
        }
        itemImg.alt = item.type;
        if (item.snippet && !item.description) {
            item.description = item.snippet;
            item.snippet = "";
        }
        let itemBody = this.appendDiv(itemRow, "col-sm-8 card-body d-flex flex-column");
        let itemTitleAnchor = this.appendAnchor(itemBody, null, null, itemAction.url);
        this.appendElement(itemTitleAnchor, "h5", "card-title", item.title).title = item.title;
        if (item.snippet) {
            this.appendElement(itemBody, "h6", "card-subtitle mb-2 text-muted", item.snippet).title = item.snippet;
        }
        if (item.description) {
            this.appendElement(itemBody, "p", "card-text", item.description);
        }
        let itemLinks = this.appendDiv(itemBody, "mt-auto");
        if (!itemAction.isItemInfo) {
            this.appendAnchor(itemLinks, "card-link", AppIcons.info(), this.portalUrl + "home/item.html?id=" + item.id);
        }
        this.appendAnchor(itemLinks, "card-link", itemAction.iconSvg, itemAction.url);
    }
    getItemAction(item) {
        let res = { url: "", iconSvg: AppIcons.externalLink(), isItemInfo: false };
        if (item.type == "Web Map") {
            res.url = this.portalUrl + "home/webmap/viewer.html?webmap=" + item.id;
        }
        else if ((item.type == "Web Mapping Application") && (item.url)) {
            res.url = item.url;
        }
        else if ((item.type == "Dashboard")) {
            res.url = this.portalUrl + "apps/opsdashboard/index.html#/" + item.id;
        }
        else {
            res.url = this.portalUrl + "home/item.html?id=" + item.id;
            res.iconSvg = AppIcons.info();
            res.isItemInfo = true;
            console.log("Default item action used.", "item.name:", item.name, "item.type:", item.type);
        }
        return res;
    }
    appendMoreItems() {
        let groupId = agpLandingPageConfig.group;
        this.loadMoreItemsButton.style.display = "none";
        this.loadMoreItemsProgress.style.display = "";
        return agp.fetchApiJson(this.portalUrl, "search?f=json&q=group%3A" + groupId + "&num=16&start=" + this.lastSearchResult.nextStart)
            .then((items) => {
            this.appendItems(items);
        })
            .catch((reason) => {
            this.loadMoreItemsButton.style.display = "none";
            this.loadMoreItemsProgress.style.display = "";
            this.loadMoreItemsProgress.style.width = "";
            this.loadMoreItemsProgress.className = "alert alert-danger";
            this.loadMoreItemsProgress.innerHTML = "Failed to load Group items " + this.portalUrl + "home/group.html?id=" + groupId;
            console.warn(this.loadMoreItemsButton.innerHTML);
            console.warn(reason);
        });
    }
    appendElement(owner, tag, className, html) {
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
    appendDiv(owner, className) {
        return this.appendElement(owner, "div", className, undefined);
    }
    appendImg(owner, className) {
        return this.appendElement(owner, "img", className, undefined);
    }
    appendAnchor(owner, className, html, url) {
        let a = this.appendElement(owner, "a", className, html);
        a.target = "_blank";
        a.href = url;
        return a;
    }
}
exports.AppView = AppView;
if (isDebugDebugMode) {
    console.log("Loading ArcGIS Portal data", agpLandingPageConfig);
}
//# sourceMappingURL=app.js.map