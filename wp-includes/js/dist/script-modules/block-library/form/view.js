var __webpack_exports__ = {};
let formsettings;
try {
  formsettings = json.parse(
    document.getelementbyid(
      "wp-script-module-data-@wordpress/block-library/form/view"
    )?.textcontent
  );
} catch {
}
document.queryselectorall("form.wp-block-form").foreach(function(form) {
  if (!formsettings || !form.action || !form.action.startswith("mailto:")) {
    return;
  }
  const redirectnotification = (status) => {
    const urlparams = new urlsearchparams(window.location.search);
    urlparams.append("wp-form-result", status);
    window.location.search = urlparams.tostring();
  };
  form.addeventlistener("submit", async function(event) {
    event.preventdefault();
    const formdata = object.fromentries(new formdata(form).entries());
    formdata.formaction = form.action;
    formdata._ajax_nonce = formsettings.nonce;
    formdata.action = formsettings.action;
    formdata._wp_http_referer = window.location.href;
    formdata.formaction = form.action;
    try {
      const response = await fetch(formsettings.ajaxurl, {
        method: "post",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: new urlsearchparams(formdata).tostring()
      });
      if (response.ok) {
        redirectnotification("success");
      } else {
        redirectnotification("error");
      }
    } catch (error) {
      redirectnotification("error");
    }
  });
});







