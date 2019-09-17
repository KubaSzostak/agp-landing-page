let suggestedPortalList = [
    { portalUrl: "https://www.arcgis.com", group: "908dd46e749d4565a17d2b646ace7b1a" },
    { portalUrl: "http://www.arcgis.com", group: "908dd46e749d4565a17d2b646ace7b1a" },
    { portalUrl: "https://mapy.umgdy.gov.pl/pzp", group: "bec4867931504e4897aa927629c5e03f" },
    { portalUrl: "https://mapy.umgdy.gov.pl/portal", group: "9227744bd89342429da120fb3bba224a" }
];
export class Portal {
    constructor(portalUrl, groupId) {
        this.portalUrl = portalUrl;
        this.groupId = groupId;
        this.portalUrl = this.suggestPortalUrl(portalUrl);
        if (this.portalUrl.lastIndexOf("/") != portalUrl.length - 1) {
            this.portalUrl = this.portalUrl + "/";
        }
        this.groupId = this.suggestGroupId(groupId);
    }
    suggestPortalUrl(portalUrl) {
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
        return suggestedPortalList[0].portalUrl;
    }
    suggestGroupId(groupId) {
        if (groupId && groupId.length > 0) {
            return groupId;
        }
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("group")) {
            return urlParams.get("group");
        }
        for (const portal of suggestedPortalList) {
            if (this.portalUrl.indexOf(portal.portalUrl) === 0) {
                console.log("Default ArcGIS Portal group is set: " + this.groupId);
                return portal.group;
            }
        }
        return undefined;
    }
    fetchApiJson(apiUrl) {
        let url = this.portalUrl + "sharing/rest/" + apiUrl;
        return fetch(url)
            .then((resp) => {
            if (!resp.ok) {
                console.warn("Fetching ERROR: " + url);
                console.warn("HTTP response error", resp);
                throw new Error('HTTP error, status = ' + resp.status);
            }
            return resp.json();
        })
            .then((json) => {
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
    fetchPortal() {
        return this.fetchApiJson("portals/self?f=json")
            .then((portal) => {
            if (portal.thumbnail) {
                portal.thumbnailUrl = this.portalUrl + "sharing/rest/portals/self/resources/" + portal.thumbnail;
            }
            else if (portal.portalThumbnail) {
                portal.thumbnailUrl = this.portalUrl + "sharing/rest/portals/self/resources/" + portal.portalThumbnail;
            }
            portal.portalUrl = this.portalUrl;
            return portal;
        })
            .catch((reason) => {
            throw new Error("Failed to load Portal info " + this.portalUrl);
        });
    }
    fetchGroup(groupId) {
        if (!groupId) {
            groupId = this.groupId;
        }
        return this.fetchApiJson("community/groups/" + groupId + "?f=json")
            .then((group) => {
            if (group.thumbnail) {
                group.thumbnailUrl = this.portalUrl + "sharing/rest/community/groups/" + groupId + "/info/" + group.thumbnail;
            }
            group.groupUrl = this.portalUrl + "home/group.html?id=" + groupId;
            return group;
        })
            .catch((reason) => {
            throw new Error("Failed to load Group info " + this.portalUrl + "home/group.html?id=" + this.groupId);
        });
    }
    fetchGroupItems(group, start = 1, num = 16) {
        return this.fetchApiJson("search?f=json"
            + "&q=group%3A" + group.id
            + "&start=" + start
            + "&num=" + num
            + "&sortField=" + group.sortField
            + "&sortOrder=" + group.sortOrder)
            .then((searchResult) => {
            for (const item of searchResult.results) {
                this.initItemData(item);
            }
            return searchResult;
        })
            .catch((reason) => {
            throw new Error("Failed to load Group items " + this.portalUrl + "home/group.html?id=" + group.id);
        });
    }
    initItemData(item) {
        if (item.thumbnail) {
            item.thumbnailUrl = this.portalUrl + "sharing/rest/content/items/" + item.id + "/info/" + item.thumbnail;
        }
        item.actionType = "external";
        item.infoUrl = this.portalUrl + "home/item.html?id=" + item.id;
        if (item.type == "Web Map") {
            item.actionUrl = this.portalUrl + "home/webmap/viewer.html?webmap=" + item.id;
        }
        else if ((item.type == "Web Mapping Application") && (item.url)) {
            item.actionUrl = item.url;
        }
        else if ((item.type == "Dashboard")) {
            item.actionUrl = this.portalUrl + "apps/opsdashboard/index.html#/" + item.id;
        }
        else {
            item.actionUrl = item.infoUrl;
            item.actionType = "info";
            console.log("Default item action used.", "item.name:", item.name, "item.type:", item.type, "actionUrl:", item.actionUrl);
        }
    }
}
//# sourceMappingURL=agp.js.map