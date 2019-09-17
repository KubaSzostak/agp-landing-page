"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fetchApiJson(portalUrl, apiUrl) {
    if (portalUrl.lastIndexOf("/") != portalUrl.length - 1) {
        portalUrl = portalUrl + "/";
    }
    let url = portalUrl + "sharing/rest/" + apiUrl;
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
exports.fetchApiJson = fetchApiJson;
function fetchPortal(portalUrl) {
    return fetchApiJson(portalUrl, "portals/self?f=json")
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
exports.fetchPortal = fetchPortal;
function fetchGroups(portalUrl) {
    return fetchApiJson(portalUrl, "community/groups/" + this.groupId + "?f=json")
        .then((group) => {
        if (group.thumbnail) {
            group.thumbnailUrl = this.rootUrl("community/groups/" + this.groupId + "/info/" + group.thumbnail);
        }
        group.groupUrl = this.portalUrl + "home/group.html?id=" + this.groupId;
        return group;
    })
        .catch((reason) => {
        throw new Error("Failed to load Group info " + this.portalUrl + "home/group.html?id=" + this.groupId);
    });
}
exports.fetchGroups = fetchGroups;
function fetchGroupItems(portalUrl, group) {
    let start = 1;
    return fetchApiJson(portalUrl, "search?f=json&q=group%3A" + this.groupId
        + "&num=16&start=" + "1"
        + "&sortField=" + group.sortField + "&sortOrder=" + group.sortOrder)
        .then((items) => {
        this.view.appendItems(items);
    })
        .catch((reason) => {
        throw new Error("Failed to load Group items " + this.portalUrl + "home/group.html?id=" + this.groupId);
    });
}
exports.fetchGroupItems = fetchGroupItems;
//# sourceMappingURL=agp.js.map