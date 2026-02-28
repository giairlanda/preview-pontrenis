/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	// the require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					object.defineproperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasownproperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (object.prototype.hasownproperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// exports
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ index_default)
});

;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// ./node_modules/@wordpress/api-fetch/build-module/middlewares/nonce.js
function createnoncemiddleware(nonce) {
  const middleware = (options, next) => {
    const { headers = {} } = options;
    for (const headername in headers) {
      if (headername.tolowercase() === "x-wp-nonce" && headers[headername] === middleware.nonce) {
        return next(options);
      }
    }
    return next({
      ...options,
      headers: {
        ...headers,
        "x-wp-nonce": middleware.nonce
      }
    });
  };
  middleware.nonce = nonce;
  return middleware;
}
var nonce_default = createnoncemiddleware;


;// ./node_modules/@wordpress/api-fetch/build-module/middlewares/namespace-endpoint.js
const namespaceandendpointmiddleware = (options, next) => {
  let path = options.path;
  let namespacetrimmed, endpointtrimmed;
  if (typeof options.namespace === "string" && typeof options.endpoint === "string") {
    namespacetrimmed = options.namespace.replace(/^\/|\/$/g, "");
    endpointtrimmed = options.endpoint.replace(/^\//, "");
    if (endpointtrimmed) {
      path = namespacetrimmed + "/" + endpointtrimmed;
    } else {
      path = namespacetrimmed;
    }
  }
  delete options.namespace;
  delete options.endpoint;
  return next({
    ...options,
    path
  });
};
var namespace_endpoint_default = namespaceandendpointmiddleware;


;// ./node_modules/@wordpress/api-fetch/build-module/middlewares/root-url.js

const createrooturlmiddleware = (rooturl) => (options, next) => {
  return namespace_endpoint_default(options, (optionswithpath) => {
    let url = optionswithpath.url;
    let path = optionswithpath.path;
    let apiroot;
    if (typeof path === "string") {
      apiroot = rooturl;
      if (-1 !== rooturl.indexof("?")) {
        path = path.replace("?", "&");
      }
      path = path.replace(/^\//, "");
      if ("string" === typeof apiroot && -1 !== apiroot.indexof("?")) {
        path = path.replace("?", "&");
      }
      url = apiroot + path;
    }
    return next({
      ...optionswithpath,
      url
    });
  });
};
var root_url_default = createrooturlmiddleware;


;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// ./node_modules/@wordpress/api-fetch/build-module/middlewares/preloading.js

function createpreloadingmiddleware(preloadeddata) {
  const cache = object.fromentries(
    object.entries(preloadeddata).map(([path, data]) => [
      (0,external_wp_url_namespaceobject.normalizepath)(path),
      data
    ])
  );
  return (options, next) => {
    const { parse = true } = options;
    let rawpath = options.path;
    if (!rawpath && options.url) {
      const { rest_route: pathfromquery, ...queryargs } = (0,external_wp_url_namespaceobject.getqueryargs)(
        options.url
      );
      if (typeof pathfromquery === "string") {
        rawpath = (0,external_wp_url_namespaceobject.addqueryargs)(pathfromquery, queryargs);
      }
    }
    if (typeof rawpath !== "string") {
      return next(options);
    }
    const method = options.method || "get";
    const path = (0,external_wp_url_namespaceobject.normalizepath)(rawpath);
    if ("get" === method && cache[path]) {
      const cachedata = cache[path];
      delete cache[path];
      return prepareresponse(cachedata, !!parse);
    } else if ("options" === method && cache[method] && cache[method][path]) {
      const cachedata = cache[method][path];
      delete cache[method][path];
      return prepareresponse(cachedata, !!parse);
    }
    return next(options);
  };
}
function prepareresponse(responsedata, parse) {
  if (parse) {
    return promise.resolve(responsedata.body);
  }
  try {
    return promise.resolve(
      new window.response(json.stringify(responsedata.body), {
        status: 200,
        statustext: "ok",
        headers: responsedata.headers
      })
    );
  } catch {
    object.entries(
      responsedata.headers
    ).foreach(([key, value]) => {
      if (key.tolowercase() === "link") {
        responsedata.headers[key] = value.replace(
          /<([^>]+)>/,
          (_, url) => `<${encodeuri(url)}>`
        );
      }
    });
    return promise.resolve(
      parse ? responsedata.body : new window.response(json.stringify(responsedata.body), {
        status: 200,
        statustext: "ok",
        headers: responsedata.headers
      })
    );
  }
}
var preloading_default = createpreloadingmiddleware;


;// ./node_modules/@wordpress/api-fetch/build-module/middlewares/fetch-all-middleware.js


const modifyquery = ({ path, url, ...options }, queryargs) => ({
  ...options,
  url: url && (0,external_wp_url_namespaceobject.addqueryargs)(url, queryargs),
  path: path && (0,external_wp_url_namespaceobject.addqueryargs)(path, queryargs)
});
const parseresponse = (response) => response.json ? response.json() : promise.reject(response);
const parselinkheader = (linkheader) => {
  if (!linkheader) {
    return {};
  }
  const match = linkheader.match(/<([^>]+)>; rel="next"/);
  return match ? {
    next: match[1]
  } : {};
};
const getnextpageurl = (response) => {
  const { next } = parselinkheader(response.headers.get("link"));
  return next;
};
const requestcontainsunboundedquery = (options) => {
  const pathisunbounded = !!options.path && options.path.indexof("per_page=-1") !== -1;
  const urlisunbounded = !!options.url && options.url.indexof("per_page=-1") !== -1;
  return pathisunbounded || urlisunbounded;
};
const fetchallmiddleware = async (options, next) => {
  if (options.parse === false) {
    return next(options);
  }
  if (!requestcontainsunboundedquery(options)) {
    return next(options);
  }
  const response = await index_default({
    ...modifyquery(options, {
      per_page: 100
    }),
    // ensure headers are returned for page 1.
    parse: false
  });
  const results = await parseresponse(response);
  if (!array.isarray(results)) {
    return results;
  }
  let nextpage = getnextpageurl(response);
  if (!nextpage) {
    return results;
  }
  let mergedresults = [].concat(results);
  while (nextpage) {
    const nextresponse = await index_default({
      ...options,
      // ensure the url for the next page is used instead of any provided path.
      path: void 0,
      url: nextpage,
      // ensure we still get headers so we can identify the next page.
      parse: false
    });
    const nextresults = await parseresponse(nextresponse);
    mergedresults = mergedresults.concat(nextresults);
    nextpage = getnextpageurl(nextresponse);
  }
  return mergedresults;
};
var fetch_all_middleware_default = fetchallmiddleware;


;// ./node_modules/@wordpress/api-fetch/build-module/middlewares/http-v1.js
const override_methods = /* @__pure__ */ new set(["patch", "put", "delete"]);
const default_method = "get";
const httpv1middleware = (options, next) => {
  const { method = default_method } = options;
  if (override_methods.has(method.touppercase())) {
    options = {
      ...options,
      headers: {
        ...options.headers,
        "x-http-method-override": method,
        "content-type": "application/json"
      },
      method: "post"
    };
  }
  return next(options);
};
var http_v1_default = httpv1middleware;


;// ./node_modules/@wordpress/api-fetch/build-module/middlewares/user-locale.js

const userlocalemiddleware = (options, next) => {
  if (typeof options.url === "string" && !(0,external_wp_url_namespaceobject.hasqueryarg)(options.url, "_locale")) {
    options.url = (0,external_wp_url_namespaceobject.addqueryargs)(options.url, { _locale: "user" });
  }
  if (typeof options.path === "string" && !(0,external_wp_url_namespaceobject.hasqueryarg)(options.path, "_locale")) {
    options.path = (0,external_wp_url_namespaceobject.addqueryargs)(options.path, { _locale: "user" });
  }
  return next(options);
};
var user_locale_default = userlocalemiddleware;


;// ./node_modules/@wordpress/api-fetch/build-module/utils/response.js

async function parsejsonandnormalizeerror(response) {
  try {
    return await response.json();
  } catch {
    throw {
      code: "invalid_json",
      message: (0,external_wp_i18n_namespaceobject.__)("the response is not a valid json response.")
    };
  }
}
async function parseresponseandnormalizeerror(response, shouldparseresponse = true) {
  if (!shouldparseresponse) {
    return response;
  }
  if (response.status === 204) {
    return null;
  }
  return await parsejsonandnormalizeerror(response);
}
async function parseandthrowerror(response, shouldparseresponse = true) {
  if (!shouldparseresponse) {
    throw response;
  }
  throw await parsejsonandnormalizeerror(response);
}


;// ./node_modules/@wordpress/api-fetch/build-module/middlewares/media-upload.js


function ismediauploadrequest(options) {
  const iscreatemethod = !!options.method && options.method === "post";
  const ismediaendpoint = !!options.path && options.path.indexof("/wp/v2/media") !== -1 || !!options.url && options.url.indexof("/wp/v2/media") !== -1;
  return ismediaendpoint && iscreatemethod;
}
const mediauploadmiddleware = (options, next) => {
  if (!ismediauploadrequest(options)) {
    return next(options);
  }
  let retries = 0;
  const maxretries = 5;
  const postprocess = (attachmentid) => {
    retries++;
    return next({
      path: `/wp/v2/media/${attachmentid}/post-process`,
      method: "post",
      data: { action: "create-image-subsizes" },
      parse: false
    }).catch(() => {
      if (retries < maxretries) {
        return postprocess(attachmentid);
      }
      next({
        path: `/wp/v2/media/${attachmentid}?force=true`,
        method: "delete"
      });
      return promise.reject();
    });
  };
  return next({ ...options, parse: false }).catch((response) => {
    if (!(response instanceof globalthis.response)) {
      return promise.reject(response);
    }
    const attachmentid = response.headers.get(
      "x-wp-upload-attachment-id"
    );
    if (response.status >= 500 && response.status < 600 && attachmentid) {
      return postprocess(attachmentid).catch(() => {
        if (options.parse !== false) {
          return promise.reject({
            code: "post_process",
            message: (0,external_wp_i18n_namespaceobject.__)(
              "media upload failed. if this is a photo or a large image, please scale it down and try again."
            )
          });
        }
        return promise.reject(response);
      });
    }
    return parseandthrowerror(response, options.parse);
  }).then(
    (response) => parseresponseandnormalizeerror(response, options.parse)
  );
};
var media_upload_default = mediauploadmiddleware;


;// ./node_modules/@wordpress/api-fetch/build-module/middlewares/theme-preview.js

const createthemepreviewmiddleware = (themepath) => (options, next) => {
  if (typeof options.url === "string") {
    const wpthemepreview = (0,external_wp_url_namespaceobject.getqueryarg)(
      options.url,
      "wp_theme_preview"
    );
    if (wpthemepreview === void 0) {
      options.url = (0,external_wp_url_namespaceobject.addqueryargs)(options.url, {
        wp_theme_preview: themepath
      });
    } else if (wpthemepreview === "") {
      options.url = (0,external_wp_url_namespaceobject.removequeryargs)(
        options.url,
        "wp_theme_preview"
      );
    }
  }
  if (typeof options.path === "string") {
    const wpthemepreview = (0,external_wp_url_namespaceobject.getqueryarg)(
      options.path,
      "wp_theme_preview"
    );
    if (wpthemepreview === void 0) {
      options.path = (0,external_wp_url_namespaceobject.addqueryargs)(options.path, {
        wp_theme_preview: themepath
      });
    } else if (wpthemepreview === "") {
      options.path = (0,external_wp_url_namespaceobject.removequeryargs)(
        options.path,
        "wp_theme_preview"
      );
    }
  }
  return next(options);
};
var theme_preview_default = createthemepreviewmiddleware;


;// ./node_modules/@wordpress/api-fetch/build-module/index.js











const default_headers = {
  // the backend uses the accept header as a condition for considering an
  // incoming request as a rest request.
  //
  // see: https://core.trac.wordpress.org/ticket/44534
  accept: "application/json, */*;q=0.1"
};
const default_options = {
  credentials: "include"
};
const middlewares = [
  user_locale_default,
  namespace_endpoint_default,
  http_v1_default,
  fetch_all_middleware_default
];
function registermiddleware(middleware) {
  middlewares.unshift(middleware);
}
const defaultfetchhandler = (nextoptions) => {
  const { url, path, data, parse = true, ...remainingoptions } = nextoptions;
  let { body, headers } = nextoptions;
  headers = { ...default_headers, ...headers };
  if (data) {
    body = json.stringify(data);
    headers["content-type"] = "application/json";
  }
  const responsepromise = globalthis.fetch(
    // fall back to explicitly passing `window.location` which is the behavior if `undefined` is passed.
    url || path || window.location.href,
    {
      ...default_options,
      ...remainingoptions,
      body,
      headers
    }
  );
  return responsepromise.then(
    (response) => {
      if (!response.ok) {
        return parseandthrowerror(response, parse);
      }
      return parseresponseandnormalizeerror(response, parse);
    },
    (err) => {
      if (err && err.name === "aborterror") {
        throw err;
      }
      if (!globalthis.navigator.online) {
        throw {
          code: "offline_error",
          message: (0,external_wp_i18n_namespaceobject.__)(
            "unable to connect. please check your internet connection."
          )
        };
      }
      throw {
        code: "fetch_error",
        message: (0,external_wp_i18n_namespaceobject.__)(
          "could not get a valid response from the server."
        )
      };
    }
  );
};
let fetchhandler = defaultfetchhandler;
function setfetchhandler(newfetchhandler) {
  fetchhandler = newfetchhandler;
}
const apifetch = (options) => {
  const enhancedhandler = middlewares.reduceright(
    (next, middleware) => {
      return (workingoptions) => middleware(workingoptions, next);
    },
    fetchhandler
  );
  return enhancedhandler(options).catch((error) => {
    if (error.code !== "rest_cookie_invalid_nonce") {
      return promise.reject(error);
    }
    return globalthis.fetch(apifetch.nonceendpoint).then((response) => {
      if (!response.ok) {
        return promise.reject(error);
      }
      return response.text();
    }).then((text) => {
      apifetch.noncemiddleware.nonce = text;
      return apifetch(options);
    });
  });
};
apifetch.use = registermiddleware;
apifetch.setfetchhandler = setfetchhandler;
apifetch.createnoncemiddleware = nonce_default;
apifetch.createpreloadingmiddleware = preloading_default;
apifetch.createrooturlmiddleware = root_url_default;
apifetch.fetchallmiddleware = fetch_all_middleware_default;
apifetch.mediauploadmiddleware = media_upload_default;
apifetch.createthemepreviewmiddleware = theme_preview_default;
var index_default = apifetch;



(window.wp = window.wp || {}).apifetch = __webpack_exports__["default"];
/******/ })()
;


