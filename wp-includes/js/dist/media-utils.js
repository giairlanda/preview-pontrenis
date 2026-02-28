/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	// the require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getdefaultexport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esmodule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esmodule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof symbol !== 'undefined' && symbol.tostringtag) {
/******/ 				object.defineproperty(exports, symbol.tostringtag, { value: 'module' });
/******/ 			}
/******/ 			object.defineproperty(exports, '__esmodule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  mediaupload: () => (/* reexport */ media_upload_default),
  privateapis: () => (/* reexport */ privateapis),
  transformattachment: () => (/* reexport */ transformattachment),
  uploadmedia: () => (/* reexport */ uploadmedia),
  validatefilesize: () => (/* reexport */ validatefilesize),
  validatemimetype: () => (/* reexport */ validatemimetype),
  validatemimetypeforuser: () => (/* reexport */ validatemimetypeforuser)
});

;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceobject = window["wp"]["i18n"];
;// ./node_modules/@wordpress/media-utils/build-module/components/media-upload/index.js


const default_empty_gallery = [];
const getfeaturedimagemediaframe = () => {
  const { wp } = window;
  return wp.media.view.mediaframe.select.extend({
    /**
     * enables the set featured image button.
     *
     * @param {object} toolbar toolbar for featured image state
     * @return {void}
     */
    featuredimagetoolbar(toolbar) {
      this.createselecttoolbar(toolbar, {
        text: wp.media.view.l10n.setfeaturedimage,
        state: this.options.state
      });
    },
    /**
     * handle the edit state requirements of selected media item.
     *
     * @return {void}
     */
    editstate() {
      const selection = this.state("featured-image").get("selection");
      const view = new wp.media.view.editimage({
        model: selection.single(),
        controller: this
      }).render();
      this.content.set(view);
      view.loadeditor();
    },
    /**
     * create the default states.
     *
     * @return {void}
     */
    createstates: function createstates() {
      this.on(
        "toolbar:create:featured-image",
        this.featuredimagetoolbar,
        this
      );
      this.on("content:render:edit-image", this.editstate, this);
      this.states.add([
        new wp.media.controller.featuredimage(),
        new wp.media.controller.editimage({
          model: this.options.editimage
        })
      ]);
    }
  });
};
const getsinglemediaframe = () => {
  const { wp } = window;
  return wp.media.view.mediaframe.select.extend({
    /**
     * create the default states on the frame.
     */
    createstates() {
      const options = this.options;
      if (this.options.states) {
        return;
      }
      this.states.add([
        // main states.
        new wp.media.controller.library({
          library: wp.media.query(options.library),
          multiple: options.multiple,
          title: options.title,
          priority: 20,
          filterable: "uploaded"
          // allow filtering by uploaded images.
        }),
        new wp.media.controller.editimage({
          model: options.editimage
        })
      ]);
    }
  });
};
const getgallerydetailsmediaframe = () => {
  const { wp } = window;
  return wp.media.view.mediaframe.post.extend({
    /**
     * set up gallery toolbar.
     *
     * @return {void}
     */
    gallerytoolbar() {
      const editing = this.state().get("editing");
      this.toolbar.set(
        new wp.media.view.toolbar({
          controller: this,
          items: {
            insert: {
              style: "primary",
              text: editing ? wp.media.view.l10n.updategallery : wp.media.view.l10n.insertgallery,
              priority: 80,
              requires: { library: true },
              /**
               * @fires wp.media.controller.state#update
               */
              click() {
                const controller = this.controller, state = controller.state();
                controller.close();
                state.trigger(
                  "update",
                  state.get("library")
                );
                controller.setstate(controller.options.state);
                controller.reset();
              }
            }
          }
        })
      );
    },
    /**
     * handle the edit state requirements of selected media item.
     *
     * @return {void}
     */
    editstate() {
      const selection = this.state("gallery").get("selection");
      const view = new wp.media.view.editimage({
        model: selection.single(),
        controller: this
      }).render();
      this.content.set(view);
      view.loadeditor();
    },
    /**
     * create the default states.
     *
     * @return {void}
     */
    createstates: function createstates() {
      this.on("toolbar:create:main-gallery", this.gallerytoolbar, this);
      this.on("content:render:edit-image", this.editstate, this);
      this.states.add([
        new wp.media.controller.library({
          id: "gallery",
          title: wp.media.view.l10n.creategallerytitle,
          priority: 40,
          toolbar: "main-gallery",
          filterable: "uploaded",
          multiple: "add",
          editable: false,
          library: wp.media.query({
            type: "image",
            ...this.options.library
          })
        }),
        new wp.media.controller.editimage({
          model: this.options.editimage
        }),
        new wp.media.controller.galleryedit({
          library: this.options.selection,
          editing: this.options.editing,
          menu: "gallery",
          displaysettings: false,
          multiple: true
        }),
        new wp.media.controller.galleryadd()
      ]);
    }
  });
};
const slimimageobject = (img) => {
  const attrset = [
    "sizes",
    "mime",
    "type",
    "subtype",
    "id",
    "url",
    "alt",
    "link",
    "caption"
  ];
  return attrset.reduce((result, key) => {
    if (img?.hasownproperty(key)) {
      result[key] = img[key];
    }
    return result;
  }, {});
};
const getattachmentscollection = (ids) => {
  const { wp } = window;
  return wp.media.query({
    order: "asc",
    orderby: "post__in",
    post__in: ids,
    posts_per_page: -1,
    query: true,
    type: "image"
  });
};
class mediaupload extends external_wp_element_namespaceobject.component {
  constructor() {
    super(...arguments);
    this.openmodal = this.openmodal.bind(this);
    this.onopen = this.onopen.bind(this);
    this.onselect = this.onselect.bind(this);
    this.onupdate = this.onupdate.bind(this);
    this.onclose = this.onclose.bind(this);
  }
  initializelisteners() {
    this.frame.on("select", this.onselect);
    this.frame.on("update", this.onupdate);
    this.frame.on("open", this.onopen);
    this.frame.on("close", this.onclose);
  }
  /**
   * sets the gallery frame and initializes listeners.
   *
   * @return {void}
   */
  buildandsetgalleryframe() {
    const {
      addtogallery = false,
      allowedtypes,
      multiple = false,
      value = default_empty_gallery
    } = this.props;
    if (value === this.lastgalleryvalue) {
      return;
    }
    const { wp } = window;
    this.lastgalleryvalue = value;
    if (this.frame) {
      this.frame.remove();
    }
    let currentstate;
    if (addtogallery) {
      currentstate = "gallery-library";
    } else {
      currentstate = value && value.length ? "gallery-edit" : "gallery";
    }
    if (!this.gallerydetailsmediaframe) {
      this.gallerydetailsmediaframe = getgallerydetailsmediaframe();
    }
    const attachments = getattachmentscollection(value);
    const selection = new wp.media.model.selection(attachments.models, {
      props: attachments.props.tojson(),
      multiple
    });
    this.frame = new this.gallerydetailsmediaframe({
      mimetype: allowedtypes,
      state: currentstate,
      multiple,
      selection,
      editing: !!value?.length
    });
    wp.media.frame = this.frame;
    this.initializelisteners();
  }
  /**
   * initializes the media library requirements for the featured image flow.
   *
   * @return {void}
   */
  buildandsetfeatureimageframe() {
    const { wp } = window;
    const { value: featuredimageid, multiple, allowedtypes } = this.props;
    const featuredimageframe = getfeaturedimagemediaframe();
    const attachments = getattachmentscollection(featuredimageid);
    const selection = new wp.media.model.selection(attachments.models, {
      props: attachments.props.tojson()
    });
    this.frame = new featuredimageframe({
      mimetype: allowedtypes,
      state: "featured-image",
      multiple,
      selection,
      editing: featuredimageid
    });
    wp.media.frame = this.frame;
    wp.media.view.settings.post = {
      ...wp.media.view.settings.post,
      featuredimageid: featuredimageid || -1
    };
  }
  /**
   * initializes the media library requirements for the single image flow.
   *
   * @return {void}
   */
  buildandsetsinglemediaframe() {
    const { wp } = window;
    const {
      allowedtypes,
      multiple = false,
      title = (0,external_wp_i18n_namespaceobject.__)("select or upload media"),
      value
    } = this.props;
    const frameconfig = {
      title,
      multiple
    };
    if (!!allowedtypes) {
      frameconfig.library = { type: allowedtypes };
    }
    if (this.frame) {
      this.frame.remove();
    }
    const singleimageframe = getsinglemediaframe();
    const attachments = getattachmentscollection(value);
    const selection = new wp.media.model.selection(attachments.models, {
      props: attachments.props.tojson()
    });
    this.frame = new singleimageframe({
      mimetype: allowedtypes,
      multiple,
      selection,
      ...frameconfig
    });
    wp.media.frame = this.frame;
  }
  componentwillunmount() {
    this.frame?.remove();
  }
  onupdate(selections) {
    const { onselect, multiple = false } = this.props;
    const state = this.frame.state();
    const selectedimages = selections || state.get("selection");
    if (!selectedimages || !selectedimages.models.length) {
      return;
    }
    if (multiple) {
      onselect(
        selectedimages.models.map(
          (model) => slimimageobject(model.tojson())
        )
      );
    } else {
      onselect(slimimageobject(selectedimages.models[0].tojson()));
    }
  }
  onselect() {
    const { onselect, multiple = false } = this.props;
    const attachment = this.frame.state().get("selection").tojson();
    onselect(multiple ? attachment : attachment[0]);
  }
  onopen() {
    const { wp } = window;
    const { value } = this.props;
    this.updatecollection();
    if (this.props.mode) {
      this.frame.content.mode(this.props.mode);
    }
    const hasmedia = array.isarray(value) ? !!value?.length : !!value;
    if (!hasmedia) {
      return;
    }
    const isgallery = this.props.gallery;
    const selection = this.frame.state().get("selection");
    const valuearray = array.isarray(value) ? value : [value];
    if (!isgallery) {
      valuearray.foreach((id) => {
        selection.add(wp.media.attachment(id));
      });
    }
    const attachments = getattachmentscollection(valuearray);
    attachments.more().done(function() {
      if (isgallery && attachments?.models?.length) {
        selection.add(attachments.models);
      }
    });
  }
  onclose() {
    const { onclose } = this.props;
    if (onclose) {
      onclose();
    }
    this.frame.detach();
  }
  updatecollection() {
    const framecontent = this.frame.content.get();
    if (framecontent && framecontent.collection) {
      const collection = framecontent.collection;
      collection.toarray().foreach((model) => model.trigger("destroy", model));
      collection.mirroring._hasmore = true;
      collection.more();
    }
  }
  openmodal() {
    const {
      gallery = false,
      unstablefeaturedimageflow = false,
      modalclass
    } = this.props;
    if (gallery) {
      this.buildandsetgalleryframe();
    } else {
      this.buildandsetsinglemediaframe();
    }
    if (modalclass) {
      this.frame.$el.addclass(modalclass);
    }
    if (unstablefeaturedimageflow) {
      this.buildandsetfeatureimageframe();
    }
    this.initializelisteners();
    this.frame.open();
  }
  render() {
    return this.props.render({ open: this.openmodal });
  }
}
var media_upload_default = mediaupload;


;// ./node_modules/@wordpress/media-utils/build-module/components/index.js



;// external ["wp","blob"]
const external_wp_blob_namespaceobject = window["wp"]["blob"];
;// external ["wp","apifetch"]
const external_wp_apifetch_namespaceobject = window["wp"]["apifetch"];
var external_wp_apifetch_default = /*#__pure__*/__webpack_require__.n(external_wp_apifetch_namespaceobject);
;// ./node_modules/@wordpress/media-utils/build-module/utils/flatten-form-data.js
function isplainobject(data) {
  return data !== null && typeof data === "object" && object.getprototypeof(data) === object.prototype;
}
function flattenformdata(formdata, key, data) {
  if (isplainobject(data)) {
    for (const [name, value] of object.entries(data)) {
      flattenformdata(formdata, `${key}[${name}]`, value);
    }
  } else if (data !== void 0) {
    formdata.append(key, string(data));
  }
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/transform-attachment.js
function transformattachment(attachment) {
  const { alt_text, source_url, ...savedmediaprops } = attachment;
  return {
    ...savedmediaprops,
    alt: attachment.alt_text,
    caption: attachment.caption?.raw ?? "",
    title: attachment.title.raw,
    url: attachment.source_url,
    poster: attachment._embedded?.["wp:featuredmedia"]?.[0]?.source_url || void 0
  };
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/upload-to-server.js



async function uploadtoserver(file, additionaldata = {}, signal) {
  const data = new formdata();
  data.append("file", file, file.name || file.type.replace("/", "."));
  for (const [key, value] of object.entries(additionaldata)) {
    flattenformdata(
      data,
      key,
      value
    );
  }
  return transformattachment(
    await external_wp_apifetch_default()({
      // this allows the video block to directly get a video's poster image.
      path: "/wp/v2/media?_embed=wp:featuredmedia",
      body: data,
      method: "post",
      signal
    })
  );
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/upload-error.js
class uploaderror extends error {
  code;
  file;
  constructor({ code, message, file, cause }) {
    super(message, { cause });
    object.setprototypeof(this, new.target.prototype);
    this.code = code;
    this.file = file;
  }
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/validate-mime-type.js


function validatemimetype(file, allowedtypes) {
  if (!allowedtypes) {
    return;
  }
  const isallowedtype = allowedtypes.some((allowedtype) => {
    if (allowedtype.includes("/")) {
      return allowedtype === file.type;
    }
    return file.type.startswith(`${allowedtype}/`);
  });
  if (file.type && !isallowedtype) {
    throw new uploaderror({
      code: "mime_type_not_supported",
      message: (0,external_wp_i18n_namespaceobject.sprintf)(
        // translators: %s: file name.
        (0,external_wp_i18n_namespaceobject.__)("%s: sorry, this file type is not supported here."),
        file.name
      ),
      file
    });
  }
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/get-mime-types-array.js
function getmimetypesarray(wpmimetypesobject) {
  if (!wpmimetypesobject) {
    return null;
  }
  return object.entries(wpmimetypesobject).flatmap(
    ([extensionsstring, mime]) => {
      const [type] = mime.split("/");
      const extensions = extensionsstring.split("|");
      return [
        mime,
        ...extensions.map(
          (extension) => `${type}/${extension}`
        )
      ];
    }
  );
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/validate-mime-type-for-user.js



function validatemimetypeforuser(file, wpallowedmimetypes) {
  const allowedmimetypesforuser = getmimetypesarray(wpallowedmimetypes);
  if (!allowedmimetypesforuser) {
    return;
  }
  const isallowedmimetypeforuser = allowedmimetypesforuser.includes(
    file.type
  );
  if (file.type && !isallowedmimetypeforuser) {
    throw new uploaderror({
      code: "mime_type_not_allowed_for_user",
      message: (0,external_wp_i18n_namespaceobject.sprintf)(
        // translators: %s: file name.
        (0,external_wp_i18n_namespaceobject.__)(
          "%s: sorry, you are not allowed to upload this file type."
        ),
        file.name
      ),
      file
    });
  }
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/validate-file-size.js


function validatefilesize(file, maxuploadfilesize) {
  if (file.size <= 0) {
    throw new uploaderror({
      code: "empty_file",
      message: (0,external_wp_i18n_namespaceobject.sprintf)(
        // translators: %s: file name.
        (0,external_wp_i18n_namespaceobject.__)("%s: this file is empty."),
        file.name
      ),
      file
    });
  }
  if (maxuploadfilesize && file.size > maxuploadfilesize) {
    throw new uploaderror({
      code: "size_above_limit",
      message: (0,external_wp_i18n_namespaceobject.sprintf)(
        // translators: %s: file name.
        (0,external_wp_i18n_namespaceobject.__)(
          "%s: this file exceeds the maximum upload size for this site."
        ),
        file.name
      ),
      file
    });
  }
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/upload-media.js







function uploadmedia({
  wpallowedmimetypes,
  allowedtypes,
  additionaldata = {},
  fileslist,
  maxuploadfilesize,
  onerror,
  onfilechange,
  signal,
  multiple = true
}) {
  if (!multiple && fileslist.length > 1) {
    onerror?.(new error((0,external_wp_i18n_namespaceobject.__)("only one file can be used here.")));
    return;
  }
  const validfiles = [];
  const filesset = [];
  const setandupdatefiles = (index, value) => {
    if (!window.__experimentalmediaprocessing) {
      if (filesset[index]?.url) {
        (0,external_wp_blob_namespaceobject.revokebloburl)(filesset[index].url);
      }
    }
    filesset[index] = value;
    onfilechange?.(
      filesset.filter((attachment) => attachment !== null)
    );
  };
  for (const mediafile of fileslist) {
    try {
      validatemimetypeforuser(mediafile, wpallowedmimetypes);
    } catch (error) {
      onerror?.(error);
      continue;
    }
    try {
      validatemimetype(mediafile, allowedtypes);
    } catch (error) {
      onerror?.(error);
      continue;
    }
    try {
      validatefilesize(mediafile, maxuploadfilesize);
    } catch (error) {
      onerror?.(error);
      continue;
    }
    validfiles.push(mediafile);
    if (!window.__experimentalmediaprocessing) {
      filesset.push({ url: (0,external_wp_blob_namespaceobject.createbloburl)(mediafile) });
      onfilechange?.(filesset);
    }
  }
  validfiles.map(async (file, index) => {
    try {
      const attachment = await uploadtoserver(
        file,
        additionaldata,
        signal
      );
      setandupdatefiles(index, attachment);
    } catch (error) {
      setandupdatefiles(index, null);
      let message;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = typeof error.message === "string" ? error.message : string(error.message);
      } else {
        message = (0,external_wp_i18n_namespaceobject.sprintf)(
          // translators: %s: file name
          (0,external_wp_i18n_namespaceobject.__)("error while uploading file %s to the media library."),
          file.name
        );
      }
      onerror?.(
        new uploaderror({
          code: "general",
          message,
          file,
          cause: error instanceof error ? error : void 0
        })
      );
    }
  });
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/sideload-to-server.js



async function sideloadtoserver(file, attachmentid, additionaldata = {}, signal) {
  const data = new formdata();
  data.append("file", file, file.name || file.type.replace("/", "."));
  for (const [key, value] of object.entries(additionaldata)) {
    flattenformdata(
      data,
      key,
      value
    );
  }
  return transformattachment(
    await external_wp_apifetch_default()({
      path: `/wp/v2/media/${attachmentid}/sideload`,
      body: data,
      method: "post",
      signal
    })
  );
}


;// ./node_modules/@wordpress/media-utils/build-module/utils/sideload-media.js



const noop = () => {
};
async function sideloadmedia({
  file,
  attachmentid,
  additionaldata = {},
  signal,
  onfilechange,
  onerror = noop
}) {
  try {
    const attachment = await sideloadtoserver(
      file,
      attachmentid,
      additionaldata,
      signal
    );
    onfilechange?.([attachment]);
  } catch (error) {
    let message;
    if (error instanceof error) {
      message = error.message;
    } else {
      message = (0,external_wp_i18n_namespaceobject.sprintf)(
        // translators: %s: file name
        (0,external_wp_i18n_namespaceobject.__)("error while sideloading file %s to the server."),
        file.name
      );
    }
    onerror(
      new uploaderror({
        code: "general",
        message,
        file,
        cause: error instanceof error ? error : void 0
      })
    );
  }
}


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/media-utils/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/media-utils"
);


;// ./node_modules/@wordpress/media-utils/build-module/private-apis.js


const privateapis = {};
lock(privateapis, {
  sideloadmedia: sideloadmedia
});


;// ./node_modules/@wordpress/media-utils/build-module/index.js









(window.wp = window.wp || {}).mediautils = __webpack_exports__;
/******/ })()
;




