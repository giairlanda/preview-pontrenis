import * as __webpack_external_module__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ 317:
/***/ ((module) => {

module.exports = import("@wordpress/a11y");;

/***/ })

/******/ });
/************************************************************************/
/******/ // the module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // the require function
/******/ function __webpack_require__(moduleid) {
/******/ 	// check if module is in cache
/******/ 	var cachedmodule = __webpack_module_cache__[moduleid];
/******/ 	if (cachedmodule !== undefined) {
/******/ 		return cachedmodule.exports;
/******/ 	}
/******/ 	// create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleid] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// execute the module function
/******/ 	__webpack_modules__[moduleid](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				object.defineproperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasownproperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (object.prototype.hasownproperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// exports
__webpack_require__.d(__webpack_exports__, {
  o: () => (/* binding */ actions),
  w: () => (/* binding */ state)
});

;// external "@wordpress/interactivity"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const interactivity_namespaceobject = x({ ["getconfig"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.getconfig), ["privateapis"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.privateapis), ["store"]: () => (__webpack_external_module__wordpress_interactivity_8e89b257__.store) });
;// ./node_modules/@wordpress/interactivity-router/build-module/assets/scs.js
function shortestcommonsupersequence(x, y, isequal = (a, b) => a === b) {
  const m = x.length;
  const n = y.length;
  const dp = array.from(
    { length: m + 1 },
    () => array(n + 1).fill(null)
  );
  for (let i = 0; i <= m; i++) {
    dp[i][0] = x.slice(0, i);
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = y.slice(0, j);
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (isequal(x[i - 1], y[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1].concat(x[i - 1]);
      } else {
        const option1 = dp[i - 1][j].concat(x[i - 1]);
        const option2 = dp[i][j - 1].concat(y[j - 1]);
        dp[i][j] = option1.length <= option2.length ? option1 : option2;
      }
    }
  }
  return dp[m][n];
}


;// ./node_modules/@wordpress/interactivity-router/build-module/assets/styles.js

const arenodesequal = (a, b) => a.isequalnode(b);
const normalizemedia = (element) => {
  element = element.clonenode(true);
  const media = element.media;
  const { originalmedia } = element.dataset;
  if (media === "preload") {
    element.media = originalmedia || "all";
    element.removeattribute("data-original-media");
  } else if (!element.media) {
    element.media = "all";
  }
  return element;
};
function updatestyleswithscs(x, y, parent = window.document.head) {
  if (x.length === 0) {
    return y.map((element) => {
      const promise = preparestylepromise(element);
      parent.appendchild(element);
      return promise;
    });
  }
  const xnormalized = x.map(normalizemedia);
  const ynormalized = y.map(normalizemedia);
  const scs = shortestcommonsupersequence(
    xnormalized,
    ynormalized,
    arenodesequal
  );
  const xlength = x.length;
  const ylength = y.length;
  const promises = [];
  let last = x[xlength - 1];
  let xindex = 0;
  let yindex = 0;
  for (const scselement of scs) {
    const xelement = x[xindex];
    const yelement = y[yindex];
    const xnormel = xnormalized[xindex];
    const ynormel = ynormalized[yindex];
    if (xindex < xlength && arenodesequal(xnormel, scselement)) {
      if (yindex < ylength && arenodesequal(ynormel, scselement)) {
        promises.push(preparestylepromise(xelement));
        yindex++;
      }
      xindex++;
    } else {
      promises.push(preparestylepromise(yelement));
      if (xindex < xlength) {
        xelement.before(yelement);
      } else {
        last.after(yelement);
        last = yelement;
      }
      yindex++;
    }
  }
  return promises;
}
const stylepromisecache = /* @__pure__ */ new weakmap();
const preparestylepromise = (element) => {
  if (stylepromisecache.has(element)) {
    return stylepromisecache.get(element);
  }
  if (window.document.contains(element) && element.media !== "preload") {
    const promise2 = promise.resolve(element);
    stylepromisecache.set(element, promise2);
    return promise2;
  }
  if (element.hasattribute("media") && element.media !== "all") {
    element.dataset.originalmedia = element.media;
  }
  element.media = "preload";
  if (element instanceof htmlstyleelement) {
    const promise2 = promise.resolve(element);
    stylepromisecache.set(element, promise2);
    return promise2;
  }
  const promise = new promise((resolve, reject) => {
    element.addeventlistener("load", () => resolve(element));
    element.addeventlistener("error", (event) => {
      const { href } = event.target;
      reject(
        error(
          `the style sheet with the following url failed to load: ${href}`
        )
      );
    });
  });
  stylepromisecache.set(element, promise);
  return promise;
};
const stylesheetcache = /* @__pure__ */ new map();
const preloadstyles = (doc, url) => {
  if (!stylesheetcache.has(url)) {
    const currentstyleelements = array.from(
      window.document.queryselectorall(
        "style,link[rel=stylesheet]"
      )
    );
    const newstyleelements = array.from(
      doc.queryselectorall("style,link[rel=stylesheet]")
    );
    const stylepromises = updatestyleswithscs(
      currentstyleelements,
      newstyleelements
    );
    stylesheetcache.set(url, stylepromises);
  }
  return stylesheetcache.get(url);
};
const applystyles = (styles) => {
  window.document.queryselectorall("style,link[rel=stylesheet]").foreach((el) => {
    if (el.sheet) {
      if (styles.includes(el)) {
        if (el.sheet.media.mediatext === "preload") {
          const { originalmedia = "all" } = el.dataset;
          el.sheet.media.mediatext = originalmedia;
        }
        el.sheet.disabled = false;
      } else {
        el.sheet.disabled = true;
      }
    }
  });
};


;// ./node_modules/@wordpress/interactivity-router/build-module/assets/dynamic-importmap/resolver.js
const backslashregex = /\\/g;
function isurl(url) {
  if (url.indexof(":") === -1) {
    return false;
  }
  try {
    new url(url);
    return true;
  } catch (_) {
    return false;
  }
}
function resolveifnotplainorurl(relurl, parenturl) {
  const hidx = parenturl.indexof("#"), qidx = parenturl.indexof("?");
  if (hidx + qidx > -2) {
    parenturl = parenturl.slice(
      0,
      // eslint-disable-next-line no-nested-ternary
      hidx === -1 ? qidx : qidx === -1 || qidx > hidx ? hidx : qidx
    );
  }
  if (relurl.indexof("\\") !== -1) {
    relurl = relurl.replace(backslashregex, "/");
  }
  if (relurl[0] === "/" && relurl[1] === "/") {
    return parenturl.slice(0, parenturl.indexof(":") + 1) + relurl;
  } else if (relurl[0] === "." && (relurl[1] === "/" || relurl[1] === "." && (relurl[2] === "/" || relurl.length === 2 && (relurl += "/")) || relurl.length === 1 && (relurl += "/")) || relurl[0] === "/") {
    const parentprotocol = parenturl.slice(
      0,
      parenturl.indexof(":") + 1
    );
    let pathname;
    if (parenturl[parentprotocol.length + 1] === "/") {
      if (parentprotocol !== "file:") {
        pathname = parenturl.slice(parentprotocol.length + 2);
        pathname = pathname.slice(pathname.indexof("/") + 1);
      } else {
        pathname = parenturl.slice(8);
      }
    } else {
      pathname = parenturl.slice(
        parentprotocol.length + (parenturl[parentprotocol.length] === "/")
      );
    }
    if (relurl[0] === "/") {
      return parenturl.slice(0, parenturl.length - pathname.length - 1) + relurl;
    }
    const segmented = pathname.slice(0, pathname.lastindexof("/") + 1) + relurl;
    const output = [];
    let segmentindex = -1;
    for (let i = 0; i < segmented.length; i++) {
      if (segmentindex !== -1) {
        if (segmented[i] === "/") {
          output.push(segmented.slice(segmentindex, i + 1));
          segmentindex = -1;
        }
        continue;
      } else if (segmented[i] === ".") {
        if (segmented[i + 1] === "." && (segmented[i + 2] === "/" || i + 2 === segmented.length)) {
          output.pop();
          i += 2;
          continue;
        } else if (segmented[i + 1] === "/" || i + 1 === segmented.length) {
          i += 1;
          continue;
        }
      }
      while (segmented[i] === "/") {
        i++;
      }
      segmentindex = i;
    }
    if (segmentindex !== -1) {
      output.push(segmented.slice(segmentindex));
    }
    return parenturl.slice(0, parenturl.length - pathname.length) + output.join("");
  }
}
function resolveurl(relurl, parenturl) {
  return resolveifnotplainorurl(relurl, parenturl) || (isurl(relurl) ? relurl : resolveifnotplainorurl("./" + relurl, parenturl));
}
function getmatch(path, matchobj) {
  if (matchobj[path]) {
    return path;
  }
  let sepindex = path.length;
  do {
    const segment = path.slice(0, sepindex + 1);
    if (segment in matchobj) {
      return segment;
    }
  } while ((sepindex = path.lastindexof("/", sepindex - 1)) !== -1);
}
function applypackages(id, packages) {
  const pkgname = getmatch(id, packages);
  if (pkgname) {
    const pkg = packages[pkgname];
    if (pkg === null) {
      return;
    }
    return pkg + id.slice(pkgname.length);
  }
}
function resolveimportmap(importmap2, resolvedorplain, parenturl) {
  let scopeurl = parenturl && getmatch(parenturl, importmap2.scopes);
  while (scopeurl) {
    const packageresolution = applypackages(
      resolvedorplain,
      importmap2.scopes[scopeurl]
    );
    if (packageresolution) {
      return packageresolution;
    }
    scopeurl = getmatch(
      scopeurl.slice(0, scopeurl.lastindexof("/")),
      importmap2.scopes
    );
  }
  return applypackages(resolvedorplain, importmap2.imports) || resolvedorplain.indexof(":") !== -1 && resolvedorplain;
}
function resolveandcomposepackages(packages, outpackages, baseurl2, parentmap) {
  for (const p in packages) {
    const resolvedlhs = resolveifnotplainorurl(p, baseurl2) || p;
    const target = packages[p];
    if (typeof target !== "string") {
      continue;
    }
    const mapped = resolveimportmap(
      parentmap,
      resolveifnotplainorurl(target, baseurl2) || target,
      baseurl2
    );
    if (mapped) {
      outpackages[resolvedlhs] = mapped;
      continue;
    }
  }
}
function resolveandcomposeimportmap(json, baseurl2, parentmap) {
  const outmap = {
    imports: object.assign({}, parentmap.imports),
    scopes: object.assign({}, parentmap.scopes)
  };
  if (json.imports) {
    resolveandcomposepackages(
      json.imports,
      outmap.imports,
      baseurl2,
      parentmap
    );
  }
  if (json.scopes) {
    for (const s in json.scopes) {
      const resolvedscope = resolveurl(s, baseurl2);
      resolveandcomposepackages(
        json.scopes[s],
        outmap.scopes[resolvedscope] || (outmap.scopes[resolvedscope] = {}),
        baseurl2,
        parentmap
      );
    }
  }
  return outmap;
}
let importmap = { imports: {}, scopes: {} };
const baseurl = document.baseuri;
const pagebaseurl = baseurl;
function resolver_addimportmap(importmapin) {
  importmap = resolveandcomposeimportmap(
    importmapin,
    pagebaseurl,
    importmap
  );
}
function resolve(id, parenturl) {
  const urlresolved = resolveifnotplainorurl(id, parenturl);
  return resolveimportmap(importmap, urlresolved || id, parenturl) || id;
}


;// ./node_modules/es-module-lexer/dist/lexer.js
/* es-module-lexer 1.7.0 */
var importtype;!function(a){a[a.static=1]="static",a[a.dynamic=2]="dynamic",a[a.importmeta=3]="importmeta",a[a.staticsourcephase=4]="staticsourcephase",a[a.dynamicsourcephase=5]="dynamicsourcephase",a[a.staticdeferphase=6]="staticdeferphase",a[a.dynamicdeferphase=7]="dynamicdeferphase"}(importtype||(importtype={}));const a=1===new uint8array(new uint16array([1]).buffer)[0];function parse(e,g="@"){if(!c)return init.then((()=>parse(e)));const i=e.length+1,w=(c.__heap_base.value||c.__heap_base)+4*i-c.memory.buffer.bytelength;w>0&&c.memory.grow(math.ceil(w/65536));const k=c.sa(i-1);if((a?b:q)(e,new uint16array(c.memory.buffer,k,i)),!c.parse())throw object.assign(new error(`parse error ${g}:${e.slice(0,c.e()).split("\n").length}:${c.e()-e.lastindexof("\n",c.e()-1)}`),{idx:c.e()});const o=[],d=[];for(;c.ri();){const a=c.is(),q=c.ie(),b=c.it(),g=c.ai(),i=c.id(),w=c.ss(),k=c.se();let d;c.ip()&&(d=k(e.slice(-1===i?a-1:a,-1===i?q+1:q))),o.push({n:d,t:b,s:a,e:q,ss:w,se:k,d:i,a:g})}for(;c.re();){const a=c.es(),q=c.ee(),b=c.els(),g=c.ele(),i=e.slice(a,q),w=i[0],k=b<0?void 0:e.slice(b,g),o=k?k[0]:"";d.push({s:a,e:q,ls:b,le:g,n:'"'===w||"'"===w?k(i):i,ln:'"'===o||"'"===o?k(k):k})}function k(a){try{return(0,eval)(a)}catch(a){}}return[o,d,!!c.f(),!!c.ms()]}function q(a,q){const b=a.length;let c=0;for(;c<b;){const b=a.charcodeat(c);q[c++]=(255&b)<<8|b>>>8}}function b(a,q){const b=a.length;let c=0;for(;c<b;)q[c]=a.charcodeat(c++)}let c;const e=()=>{return a="agfzbqeaaaabkwhgax8bf2aef39/fwbgaaf/yaaayaf/agadf39/ax9gan9/ax9ga39/fwadmtaaaqecagicagicagicagicagicagiaawmdbaqaaauaaaaaaamdawagaaaabwagaguebqfwaqebbqmbaaegdwj/auha8galfwbbwpiacwd6fqztzw1vcnkcaajzyqaaawuaawjpcwaeamllaaucc3mabgjzzqahaml0aagcywkacqjpzaakamlwaasczxmadajlzqana2vscwaoa2vszqapanjpabaccmuaeqfmabicbxmaewvwyxjzzqauc19fagvhcf9iyxnlawekzkqwaaebf0eaiaa2aoakqqaoatwjigegaeebdgoiaeeaoweaqqagaeecaiiangkeckeaiaa2aogkqqbbadyc4albaeeanglwcueaqqa2augjqqbbadyc5albaeeangl4cueaqqa2auwjiael0weba39bacgc8akhbeeaqqaoaogkigu2avajqqagbdyc9albacafqsrqngkiciaeqsbqqeajiaqbiau2agbbacgc1akhbeeakalqcsegiaugatycacafiaa2agggbsaciajbampbacagiangigabiaqga0yibbs2agwgbsadngiuiavbadycecafiai2agqgbueangigiavba0ebqqigabsgbbs2ahwgbueakalqcsadriicogayakacqcacdqbbacgc1akga0cnaqtbaeebogcmcgslxgebf0eakal4csieqrbqqeqjiaqbqqaoaogkigq2agbbacaengl4cueaiarbfgo2aogkqqbbatoajaogbeeangiqiaqgazycdcaeiai2agggbcabngieiaqgadycaasiaeeakakqcgsvaeeakalocsgcaeeakalccwtbaxulhgebf0eakalocsgcbciaqqaoatwja0ebduf/iaabcxuaqqaoaugjkaiiqqaoatwja0ebdqseaqf/qqaoaugjkaimigbbacgc3alrqqf1qx8gabslcwbbacgc6akoahwlhgebf0eakalocsgceciaqqaoatwja0ebduf/iaabczsbax8cqeeakalocsgcfciaqqaoatajrw0aqx8pcwjaiabbacgc1alhdqbbfg8liabbacgc3alrqqf1cwsaqqaoaugjlqaycxuaqqaoauwjkaiaqqaoatwja0ebdqsvaeeakalscsgcbeeakalccwtbaxulhgebf0eakalscsgccciaqqaoatwja0ebduf/iaabcx4bax9bacgc7akoagwiaeeakalccwtbaxvbfyaagwslaqf/qqbbacgc6akiaeegakhgcsaagygcacianglocsaaqqbhcyubax9baeeakalscsiaqrbqqeqjiaabkaiaiga2auwjiabbaeclcabbac0alaolcabbac0ajaol3q0bbx8jaega0abrigakaeeaqqe6ajqkqqbbacgc2ak2apwkqqbbacgc3albfmoiatycsapbacabqqaoaoakqqf0aiicngk0ckeaqqa6aiwkqqbbadsblgpbaeeaowgyckeaqqa6akakqqbbadyckapbaeeaogd8cueaiabbgbbqngkkckeaiaa2aqgkqqbbadoaraocqajaakacqanaqqagauecaiidngkwciabiajpdqecqcadlweaigjbd2pbbuknaajaakacqajaakagakgbf2oobqeicagcaasgakegrg0eiajbl0ynayacqttgdqimbwtbac8bmaonasadebvfdqegaueeakgcceekec8narawqqatajqkdqfbaeeakakwciibngkccgwhcyadebvfdqagaueeakgmceekec8nabaxc0eaqqaoarakngkccgwbcwjaiaevaqqia0eqrg0aianbl0cnbbaydaelqqeqgqtbacgctaohakeakakwciebdaalc0eaiqigayebqqatapwjdqimaqtbacabngkwckeaqqa6ajqkcwnaqqagauecaiidngkwcgjaakacqajaakacqajaiafbacgctappdqagay8bacicqxdqqqvjdqycqajaakacqajaakacqajaakacqcacqwbqdgoqdwypdw8pbqecaascqajaakacqcacqab/ag4kcxisaxibehisagaliajbhx9qdgmfeqyjc0ealwgycg0qiamqfuunecabqqrqqyiiqqoqlw0qebymeasgaxavrq0piafbbgpbjahbchavdq8qfwwpcyadebvfdq4gaskabelsgisdsi7aovindiablwemignbd2oiauexsw0mqqegaxrbn4cabhffdqwmdqtbaeealwgyciibqqfqowgyckeakakkciabqqn0aiibqqe2agagaueakakccjycbawnc0ealwgyciidrq0jqqaga0f/aiidowgyckealwgwciicrq0mqqaoaqqkianb//8dcueddgooagbbbucndajaiajbanrbacgcqapqqxxqkaiaigmoagqnacadqqaoapwkqqjqngiec0eaiajbf2o7azykiamgaueeajycdawmcwjaqqaoapwkigevaqbbkucnaeeakalwcsidrq0aiamoagqgaucnaeeaqqaoavqjigm2avajakaga0unacadqqa2aiamaqtbaeeanglgcqtbaeealwgyciidqqfqowgyckeakakkciadqqn0aiidqqzbakealqcschs2agagayabngieqqbbadoaraomcwtbac8bmaoiauunb0eaiafbf2oiatsbmapbacgcpaogauh//wnxqqn0aigcaeeerg0edaolqscqggwjc0eiebomcasgakevrw0hakacqcablweeigfbkkynacabqs9hdqeqgawkc0ebebkmcqscqajaakacqeeakakcciiblweaigmqg0unaajaakaga0fvag4eaakbawkliafbfmovaqbbk0ynawwicyabqx5qlweaqs1gdqimbwsga0eprw0bqqaoaqqkqqavazgkigjba3rqkaieebxfdqimbgsgauf+ai8baefqakh//wnxqqppdqulqqavazgkiqilakacqcacqf//a3eiakunacadqeyarw0aqqaoaqqkiajbf2pba3rqigqoagbbaucnacabqx5qlweaqe8arw0biaqoagrblghbaxadrq0bdaulianb/qbhdqbbacgcpaogakeddgoiaigcbbaedqqgaigcaeegrg0ecyabeb8nayadrq0dianbl0zbac0aoapbaedxdqmcqeeakal4csicrq0aiaegaigcaeknacabiaioagrndqqliafbfmohaueakalccsecakadqcabqqjqigqgak0naueaiae2apwkiaevaqahayabqx5qigqhasadecbfdqaliarbamohbascqcadqf//a3eqiuunacaeqx5qiqecqanaiafbamoiayactq0bqqagatycnaogas8bacediafbfmoibcebiamqiq0acyaeqqjqiqmliamqig0ec0eaqqe6akakdaclqqaoaqqkqqavazgkigfba3qia2pbacgcnao2agrbacabqqfqowgyckeakakkciadakedngiacxajdaulqqatapwjqqavazykqqavazgkcnjfiqimbwsqjeeaqqa6akakdamlecvbacecdaulianboafhdqelqqbbatoaraolqqbbacgcsao2apwkc0eakakwciebdaalcyaaqydqagokacaccxoaakbbacgc3akgaecnaeebdwsgaef+ahamc/4kaqz/qqbbacgcsaoiaeemaiibngkwckeakal4csecqqeqksedakacqajaakacqajaakacqajaqqaoarakigqgaucnacadechfdqelakacqajaakacqajaakaga0eqrg0aianb+wbhdqfbacaeqqjqngkwckebeckha0eakakwcieea0acqajaianb//8dcsidqsjgdqaga0enrg0aiamqlbpbacgcsaohawwbcyadebpbaeeakakwckecaiidngkwcgtbarapggjaiaqgaxatignblecnaeeaqqaoarakqqjqngkwckebeckhawsga0h9aeyna0eakakwciifiargdq8gbseeiavbacgctapndqamdwslqqagbeecajycsapbarapgkeakakwciidiamqlromagtbaeeaogcucgjaakacqajaakacqcadqz9/ag4magseaqsdcwslcwsfaasga0h2aeynbawkc0eaiarbdmoiazycsaocqajaakbbarapqz9/ag4gabicehibegtbacgcsaoibskaaklzgosd4i3amvinesaflwekecffdrfbacafqqpqngkwckeaeckac0eakakwciifqqjqqbiiqq4qlw0qiauvaraiakf3aiibqrdldq1basabdegfgiaecuundqwoc0eakakwciifkqacquyahiowjsa5ug0piauvaqoiakf3aiibqrdndqymcgtbacaeqqpqngkwckeaeckaqqaoarakiqqlqqagbeeqajycsaocqeebeckibeeqrw0aqqbbacgcsapbamo2arakqqeqkseec0eakakwciediaqqlboga0eakakwciieiamgbbacqqbbacgcsapbfmo2arakdwscqcaekqacquyahiowjsa5ug0aiaqvaqoqieunaeeaiarbcmo2arakqqeqkseeqqaoarakiqmgbbasgiadqqaoarakigqgayaeeajbaeeakakwckf+ajycsaopc0eaiarbbgoibdycsaolqqagbeegajycsapbaeeaogcuckebeckhbeeakakwciediaqqlceeqqaoarakiqigbehf/wnxigfb2wbhdqnbacacqqjqngkwckebeckhbueakakwciedqqahbawec0eaqqe6aiwkqqbbacgcsapbamo2arakc0ebeckhbeeakakwciedakagbehmaecnacadqqjqqawiqqyqlw0aqqaga0eiajycsaogaeebeclbabariajbegpb5akgahshawnaiamoagaia0unbsadqga3aggga0eqaieddaalc0eaianbfmo2arakdamlqqegaxrbn4cabhffdqmmbatbaseecwnaakacqcaedgiaaqeliavb//8dcrasgkebiqqmaqscqajaqqaoarakigqga0ynacadiaqgayaeeajbarapiqqcqcabqdsarw0aiarbihjb/qbgdqqlqqaoarakiqmcqcaeqsxhdqbbacadqqjqngkwckebeckhbueakakwciediavbihjb+wbhdqilqqaga0f+ajycsaoliafb2wbhdqjbacacqx5qngkwcg8lqqahbawacwspcyacqaabrg0aiajb+wbhdqqlqqagbuekajycsapbarapigvb+wbgdqmmagscqcacqvhqdgmbaweacyacqaabrw0cc0eaiavbego2arakakbbarapigvbkkcnaeeaqqaoarakqqjqngkwckebeckhbqsgbueorg0bc0eakakwciebiauqlbpbacgcsaoibsabtq0aiaqgayabiauqakeaqqaoarakqx5qngkwcg8liaqga0eaqqaqakeaiarbdgo2arakdwsqjqufdaekf0eaqqaoarakigbbdgoiatycsapbarapiqjbacgcsaohawjaakacqajaakacqajaakagakeurw0aqqaga0ecajycsaocqeebeckiakhkaeynaajaiajb8wbgdqagakhtaecnb0eakakwciicqqjqqzwiqqyqlw0hakbbacgcnaoiaxaqdqagay8baeeurg0icyaaiaagakeiakeakalucrabdwtbacgcsaoiakecakgiceekec8nbgjaqqaoapwkigmqkg0aiamvaqbblkynbwtbaceeqqagakemajycsapbasefqquhbkebeckhakeaiqdbaseidailqqaoarakigipaajc5ycyg9cmgdlsdqucqeeakakcciideconacadlweaqs5gdqylqqahbeeaiajbcmo2arakqqihceehiqzbasehqqeqksecqqehbqwbcwjaakacqajaiajb8wbhdqagayabtq0aianbampboghbchavdqacqcadlwemigrbd2oib0exsw0aqqegb3rbn4cabhenagsgbeggauynaqtbacehqqchbkebiqqgakhkaeynaqwcc0eaiqrbacadqqxqigi2arakqqehbuebeckhcqjaqqaoarakigygakynaehmacecakagcuhmaeynaeefiqzbacehqqehccajiqimbatbacehqqehccagqqjqqawiqqyqlw0eiayvaqgqieunbatbacehqqagazycsapbbyegqqehbeeaiqvbaceiiakhagwccyadiabbcmpndqbbaceiqeqaiqicqcadkqacquwamipqjia5ug0aakacqcadlwekigrbd2oib0exsw0aqqegb3rbn4cabhenaqtbaceiiarboafhdqelqqahbueaianbcmo2arakqsohakebiqdbaieiqqeqksijqspgdqrbacadngkwckebiqrbacehqqahccajiqimagsgayegqqahbwwcc0eaiqvbaceicwjaiajbkecnaeeakakkckealwgyciicqqn0aiidqqaoarakngieqqagakebajsbmaoga0efngiaqqaoapwklweaqs5gdqrbaeeakakwciidqqjqngkwckebeckhaiaaqqaoarakqqagaxabakacqcafdqbbacgc8akhaqwbc0eakalwcsibiay2ahwlqqbbac8blgoia0ebajsblgpbacgcqaoga0ecdgogatycaajaiajbikynacacqsdgdqbbaeeakakwckf+ajycsaopcyacebpbaeeakakwckecaiicngkwcgjaakacqeebeclbv2oobaecagacc0eaqqaoarakqqjqngkwckebeckaqqaoavajigmgajycbcadqqe6abgga0eakakwciicngiqqqagakf+ajycsaopc0eakalwcsidiai2agqga0ebogayqqbbac8bmapbf2o7azgkianbacgcsapbamo2agxbaeealwgwckf/ajsblgopc0eaqqaoarakqx5qngkwcg8lakagbeebcyacqfsar3inaeeakakwciecqqavazgkdqudqajaakacqcacqqaoarqktw0aqqeqksicqsjgdqegakenrg0biajb/qbhdqjbaeeakakwckecajycsaolqqeqksedqqaoarakiqicqcadqeyarw0aiajbampbrahbbhavdqclqqagakeiajycsaocqeebeckiakeirg0aiajbj0cnbwsgacacqqaqkw8liaiqggtbaeeakakwckecaiicngkwcgwacwscqajaiajbwwoobambaqmacyacqsjgdqilqqaoarakiqyliaygaucnaeeaiabbcmo2arakdwsgakeqryahcq0dqqavazgkqf//a3ena0eakakwciecqqaoarqkiqedqcaciafpdqecqajaiaivaqaia0enrg0aianbikcnaqsgacadiagqkw8lqqagakecaiicngkwcgwacwsqjqspc0eaiajbfmo2arakdwtbaeeakakwckf+ajycsaolrwedf0eakakwckecaieaqqaoarqkiqecqanaiaaiakf+aiabtw0biajbamohacaclweaqxzqdgqbaaabaaslqqagajycsaolmaeba39baeeakakwciibqqjqngkwciabqqzqiqfbacgctaohagnaakacqajaiafbfgogak8nacabqx5qlweaiqmcqajaiaanacadqspgdqega0f2ag4eagqeagqlianbkkcnawsgas8baeevrw0cqqagauf+ajycsaomaqsgauf+aiebc0eaiae2arakdwsgauecaiebdaalc4gbaqr/qqaoarakiqfbacgctaohagjaakadqcabignbamohasadiajpdqegas8bacieiabgdqicqcaeqdwarg0aiarbdmoobaibaqibcyadqqrqiqegay8bbeenrw0aianbbmogasadlwegqqpggyebdaalc0eaiae2arakecupc0eaiae2arakc2wbax8cqajaiabbx2oiauefsw0aqqegaxrbmxenaqsgaefgakh//wnxqqzjdqagaeepryaaqvhqqf//a3fbb0lxdqacqcaaqav/ag4eaqaaaqaliabb/qbhiabbhx9qqf//a3fbbelxdwtbaqsuaqf/qqehaqjaiabbpglbbraddqagaegwceedeb0nacaaqbajqqiqhsebcyabc0yba39bacedakagacacqqf0igjrigrbamoiaeeakalccsifsq0aiaagasacec8naajaiaagbucnaeebdwsgbbamiqmliamlgweban9basebakacqajaakacqajaiaavaqaiakffag4ebqqeaqalakagakgbf2oobamebaiacyacqslgdqqgakh5aecnayaaqx5qqbwjqqyqhq8liabbfmovaqbbpuypcyaaqx5qqbqjqqqqhq8liabbfmpbyalbaxaddwtbacebcyabc7qdaqj/qqahaqjaakacqajaakacqajaakacqajaiaavaqbbnh9qdhqaaqijcqkjawkjbaujcqyjbwkjcaklakacqcaaqx5qlweaqzd/ag4eaaokaqoliabbfgpbyghbahaddwsgaef8akhoceedeb0pcwjaakacqcaaqx5qlweaqy1/ag4daaeccgscqcaaqxxqlweaigjb4qbgdqagakhsaecnciaaqxpqqeuaeccpcyaaqxpqqemaeccpcyaaqxxqqdqiqqqqhq8liabbfgpb3ahbbhaddwsgaef+ai8baehvaecnbiaaqxxqlweaqeuarw0gakagaef6ai8bacicqfaarg0aiajb4wbhdqcgaef4akhoceegeb0pcyaaqxhqqfqiqqiqhq8liabbfmpb+ahbbbaddwtbasebiabbfmoiaehpabandqqgaegacuefeb0pcyaaqx5qqeqaeccpcyaaqx5qqyojqqcqhq8liabbfmpbmalbbbaddwscqcaaqx5qlweaigjb7wbgdqagakhlaecnasaaqxxqqe4aeccpcyaaqxxqqaajqqmqhsebcyabczqbax9basebakagaef3akh//wnxqqvjdqagaegaaxjboafgdqagaeeuryaaechxiqeliaelmaebfwjaakagaef3aiibqrdldqbbasabdegngiaecq0bcyaaqaabrg0aqqapc0ebc04ban9bacebakacqcaalweaigjb5qbgdqagakhraecnasaaqx5qqfgiqqqqhq8liabbfmovaqbb9qbhdqagaef8akhcceegeb0haqsgaqveaqeef0eakakwcieaqqaoarqkiqecqajaakadqcaaigjbamohacaciafpdqecqajaakagac8bacidqar/ag4fagmdaweacyadqsrhdqigai8bbeh7aecnakeaiajbbgoiadycsapbaeealwgyciicqqfqowgyckeakakkciacqqn0aiicqqq2agagaiaangiedwtbacaangkwckeaqqavazgkqx9qiga7azgkqqaoaqqkiabb//8dcueddgooagbba0cnawwecyacqqrqiqamaaslqqagadycsaoleculc3aban8cqajaa0bbaeeakakwciiaqqjqige2arakiabbacgctappdqecqajaakagas8bacibqav/ag4caqiacwjaiafbdmoobaqdawqacyabqs9hdqimbasqlhomaqtbacaaqqrqngkwcgwacwsqjqslnqebf0eaqqe6apwjqqaoarakiqbbaeeakak0ckecajycsapbacaaqqaoatwja0ebdtyckaolqwecf0ebiqecqcaalweaigjbd2pb//8dcuefsq0aiajbgafyqaabrg0aqqahasacechfdqagakeuryaaecpydwsgaqs9aqj/qqahagjaqqaoatwjigmgaesnacaalweaiafhdqacqcadiabhdqbbaq8liabbfmovaqaqiceccyacc2gban9basebakacqcaaqv9qigjbbusnaeebiaj0qtfxdqeliabb+p8dcueorg0aiabbrmpb//8dcuegsq0aakagaeglf2oiakedsw0aiajbaucnaqsgaegff2pb//8dcueessebcyabc5wbaqn/qqaoarakiqecqanaakacqcablweaigjbl0cnaajaiaevaqiiaueqrg0aiafbl0cnbbaydailiaaqgqwbcwjaakagaeunacacqxdqigfbf0snauebiaf0qz+agarxrq0bdailiaiqiuunawwbcyacqaabrw0cc0eaqqaoarakignbamoiatycsaoga0eakak0ckknaasliailmqebf0eaiqecqcaalweaqs5hdqagaef+ai8baeeurw0aiabbfgovaqbblkyhaqsgaqumbaebfwjaiafbikynacabqsdgdqaqjq8lqqaoarakiqmgaraaiaaga0ecakeakakwckeakalqcrabakagakebsa0aqqaoavajqqrbbiacqqfggzychatbaeeakakwckecajycsaocqajaakacqeeaeckiauhhaeynacabqfcarg0bqqaoarakiqemagtbacgcsaoiauecakhaceekec8nauegiqimagtbacgcsaoias8bakhpaecnacablweeqfqarw0aqqqhaiablwegqegarg0bc0eaiafbfmo2arakdwtbacabiajbaxrqngkwcgjaqqeqkuh7aeynaeeaiae2arakdwtbacgcsaoiaceca0bbacacqqjqngkwcgjaakacqeebeckiakeirg0aiajbj0cnauenebpbaeeakakwckecajycsapbarapiqimagtbihaaqqbbacgcsapbamo2arakqqeqksecdaeliaiqlceccwjaiajbokynaeeaiae2arakdwtbaeeakakwckecajycsaocqeebeckiakeirg0aiajbj0ynaeeaiae2arakdwsgahaaqqbbacgcsapbamo2arakakacqeebeckiakesrg0aiajb/qbgdqfbacabngkwcg8lqqbbacgcsapbamo2arakqqeqkuh9aeynaeeakakwciecdaelc0eakalwcsibiaa2ahagaueakakwckecajycdattaqj/akacqanaakagaeh//wnxigfbd2oiakexsw0aqqeganrbn4cabhenagsgauggauynasaaiqigaraodqjbacecqqbbacgcsaoiaeecajycsaogac8baiiadqamagsliaahagsgakh//wnxc6sbaqr/akacqeeakakwciiclweaignb4qbgdqagaseeiaahbqwbc0eaiajbbgo2arakqqeqksecqqaoarakiqucqajaiajbikynacacqsdgdqagahasgkeakakwcieedaeliaiqgkeaqqaoarakqqjqigq2arakc0ebeckha0eakakwcieccwjaiaigbuynacafiarbacaaiaagauyiahtbacabiaibeailiamlcgeef0eakakwcieaqqaoarqkiqecqajaa0agaeecaieciaagau8naqjaakagai8bacidqar/ag4caqqacyaciqaga0f2ag4eagebageliabbbgohaawacwtbacacngkwchalqqapc0eaiai2arakqd0ac0kba39bacedakagakunaajaa0agac0aacieiaetaaaibucnasabqqfqiqegaeebaieaiajbf2oiag0adailcyaeiavriqmliamlc+wbagbbgaglzgeaahgacabvahiadabtahaabwbyahqazgbvahiazqb0ageabwb1ahiaywblahiabwbtahuabgbjahqaaqbvag4acwbzaguacgb0ahyabwb5agkazqbkaguabablagmabwbuahqaaqbuagkabgbzahqayqbuahqaeqbiahiazqbhahiazqb0ahuacgbkaguaygb1agcazwblageadwbhagkadaboahiadwboagkabablagkazgbjageadabjagyaaqbuageababsaguababzaabb0akleaeaaaacaaaaaaqaaea5aaa=","undefined"!=typeof buffer?buffer.from(a,"base64"):uint8array.from(atob(a),(a=>a.charcodeat(0)));var a};const init=webassembly.compile(e()).then(webassembly.instantiate).then((({exports:a})=>{c=a}));const initsync=()=>{if(c)return;const a=new webassembly.module(e());c=new webassembly.instance(a).exports};
;// ./node_modules/@wordpress/interactivity-router/build-module/assets/dynamic-importmap/fetch.js
const fetching = (url, parent) => {
  return ` fetching ${url}${parent ? ` from ${parent}` : ""}`;
};
const jscontenttype = /^(text|application)\/(x-)?javascript(;|$)/;
async function fetchmodule(url, fetchopts, parent) {
  let res;
  try {
    res = await fetch(url, fetchopts);
  } catch (e) {
    throw error(`network error${fetching(url, parent)}.`);
  }
  if (!res.ok) {
    throw error(`error ${res.status}${fetching(url, parent)}.`);
  }
  const contenttype = res.headers.get("content-type");
  if (!jscontenttype.test(contenttype)) {
    throw error(
      `bad content-type "${contenttype}"${fetching(url, parent)}.`
    );
  }
  return { responseurl: res.url, source: await res.text() };
}


;// ./node_modules/@wordpress/interactivity-router/build-module/assets/dynamic-importmap/loader.js



const initpromise = init;
const initialimportmapelement = window.document.queryselector(
  "script#wp-importmap[type=importmap]"
);
const initialimportmap = initialimportmapelement ? json.parse(initialimportmapelement.text) : { imports: {}, scopes: {} };
const skip = (id) => object.keys(initialimportmap.imports).includes(id);
const fetchcache = {};
const registry = {};
object.keys(initialimportmap.imports).foreach((id) => {
  registry[id] = {
    bloburl: id
  };
});
async function loadall(load, seen) {
  if (load.bloburl || seen[load.url]) {
    return;
  }
  seen[load.url] = 1;
  await load.linkpromise;
  await promise.all(load.deps.map((dep) => loadall(dep, seen)));
}
function urljsstring(url) {
  return `'${url.replace(/'/g, "\\'")}'`;
}
const createblob = (source, type = "text/javascript") => url.createobjecturl(new blob([source], { type }));
function resolvedeps(load, seen) {
  if (load.bloburl || !seen[load.url]) {
    return;
  }
  seen[load.url] = 0;
  for (const dep of load.deps) {
    resolvedeps(dep, seen);
  }
  const [imports, exports] = load.analysis;
  const source = load.source;
  let resolvedsource = "";
  if (!imports.length) {
    resolvedsource += source;
  } else {
    let pushstringto = function(originalindex) {
      while (dynamicimportendstack.length && dynamicimportendstack[dynamicimportendstack.length - 1] < originalindex) {
        const dynamicimportend = dynamicimportendstack.pop();
        resolvedsource += `${source.slice(
          lastindex,
          dynamicimportend
        )}, ${urljsstring(load.responseurl)}`;
        lastindex = dynamicimportend;
      }
      resolvedsource += source.slice(lastindex, originalindex);
      lastindex = originalindex;
    };
    let lastindex = 0;
    let depindex = 0;
    const dynamicimportendstack = [];
    for (const {
      s: start,
      ss: statementstart,
      se: statementend,
      d: dynamicimportindex
    } of imports) {
      if (dynamicimportindex === -1) {
        const depload = load.deps[depindex++];
        let bloburl = depload.bloburl;
        const cycleshell = !bloburl;
        if (cycleshell) {
          if (!(bloburl = depload.shellurl)) {
            bloburl = depload.shellurl = createblob(
              `export function u$_(m){${depload.analysis[1].map(({ s, e }, i) => {
                const q = depload.source[s] === '"' || depload.source[s] === "'";
                return `e$_${i}=m${q ? `[` : "."}${depload.source.slice(s, e)}${q ? `]` : ""}`;
              }).join(",")}}${depload.analysis[1].length ? `let ${depload.analysis[1].map((_, i) => `e$_${i}`).join(",")};` : ""}export {${depload.analysis[1].map(
                ({ s, e }, i) => `e$_${i} as ${depload.source.slice(
                  s,
                  e
                )}`
              ).join(",")}}
//# sourceurl=${depload.responseurl}?cycle`
            );
          }
        }
        pushstringto(start - 1);
        resolvedsource += `/*${source.slice(
          start - 1,
          statementend
        )}*/${urljsstring(bloburl)}`;
        if (!cycleshell && depload.shellurl) {
          resolvedsource += `;import*as m$_${depindex} from'${depload.bloburl}';import{u$_ as u$_${depindex}}from'${depload.shellurl}';u$_${depindex}(m$_${depindex})`;
          depload.shellurl = void 0;
        }
        lastindex = statementend;
      } else if (dynamicimportindex === -2) {
        throw error("the import.meta property is not supported.");
      } else {
        pushstringto(statementstart);
        resolvedsource += `wpinteractivityrouterimport(`;
        dynamicimportendstack.push(statementend - 1);
        lastindex = start;
      }
    }
    if (load.shellurl) {
      resolvedsource += `
;import{u$_}from'${load.shellurl}';try{u$_({${exports.filter((e) => e.ln).map(({ s, e, ln }) => `${source.slice(s, e)}:${ln}`).join(",")}})}catch(_){};
`;
    }
    pushstringto(source.length);
  }
  let hassourceurl = false;
  resolvedsource = resolvedsource.replace(
    sourcemapurlregex,
    (match, ismapping, url) => {
      hassourceurl = !ismapping;
      return match.replace(
        url,
        () => new url(url, load.responseurl).tostring()
      );
    }
  );
  if (!hassourceurl) {
    resolvedsource += "\n//# sourceurl=" + load.responseurl;
  }
  load.bloburl = createblob(resolvedsource);
  load.source = void 0;
}
const sourcemapurlregex = /\n\/\/# source(mapping)?url=([^\n]+)\s*((;|\/\/[^#][^\n]*)\s*)*$/;
function getorcreateload(url, fetchopts, parent) {
  let load = registry[url];
  if (load) {
    return load;
  }
  load = { url };
  if (registry[url]) {
    let i = 0;
    while (registry[load.url + ++i]) {
    }
    load.url += i;
  }
  registry[load.url] = load;
  load.fetchpromise = (async () => {
    let source;
    ({ responseurl: load.responseurl, source } = await (fetchcache[url] || fetchmodule(url, fetchopts, parent)));
    try {
      load.analysis = parse(source, load.url);
    } catch (e) {
      console.error(e);
      load.analysis = [[], [], false, false];
    }
    load.source = source;
    return load;
  })();
  load.linkpromise = load.fetchpromise.then(async () => {
    let childfetchopts = fetchopts;
    load.deps = (await promise.all(
      load.analysis[0].map(async ({ n, d }) => {
        if (d !== -1 || !n) {
          return void 0;
        }
        const responseurl = resolve(
          n,
          load.responseurl || load.url
        );
        if (skip && skip(responseurl)) {
          return { bloburl: responseurl };
        }
        if (childfetchopts.integrity) {
          childfetchopts = {
            ...childfetchopts,
            integrity: void 0
          };
        }
        return getorcreateload(
          responseurl,
          childfetchopts,
          load.responseurl
        ).fetchpromise;
      })
    )).filter((l) => l);
  });
  return load;
}
const dynamicimport = (u) => import(
  /* webpackignore: true */
  u
);
async function preloadmodule(url, fetchopts) {
  await initpromise;
  const load = getorcreateload(url, fetchopts, null);
  const seen = {};
  await loadall(load, seen);
  resolvedeps(load, seen);
  await promise.resolve();
  return load;
}
async function importpreloadedmodule(load) {
  const module = await dynamicimport(load.bloburl);
  if (load.shellurl) {
    (await dynamicimport(load.shellurl)).u$_(module);
  }
  return module;
}
async function toplevelload(url, fetchopts) {
  const load = await preloadmodule(url, fetchopts);
  return importpreloadedmodule(load);
}


;// ./node_modules/@wordpress/interactivity-router/build-module/assets/dynamic-importmap/index.js


const dynamic_importmap_baseurl = document.baseuri;
const dynamic_importmap_pagebaseurl = dynamic_importmap_baseurl;
object.defineproperty(self, "wpinteractivityrouterimport", {
  value: importshim,
  writable: false,
  enumerable: false,
  configurable: false
});
async function importshim(id) {
  await initpromise;
  return toplevelload(resolve(id, dynamic_importmap_pagebaseurl), {
    credentials: "same-origin"
  });
}
async function importwithmap(id, importmapin) {
  addimportmap(importmapin);
  return importshim(id);
}
async function preloadwithmap(id, importmapin) {
  resolver_addimportmap(importmapin);
  await initpromise;
  return preloadmodule(resolve(id, dynamic_importmap_pagebaseurl), {
    credentials: "same-origin"
  });
}



;// ./node_modules/@wordpress/interactivity-router/build-module/assets/script-modules.js

const resolvedscriptmodules = /* @__pure__ */ new set();
const markscriptmoduleasresolved = (url) => {
  resolvedscriptmodules.add(url);
};
const preloadscriptmodules = (doc) => {
  const importmapelement = doc.queryselector(
    "script#wp-importmap[type=importmap]"
  );
  const importmap = importmapelement ? json.parse(importmapelement.text) : { imports: {}, scopes: {} };
  for (const key in initialimportmap.imports) {
    delete importmap.imports[key];
  }
  const moduleurls = [
    ...doc.queryselectorall(
      "script[type=module][src][data-wp-router-options]"
    )
  ].filter((script) => {
    try {
      const parsed = json.parse(
        script.getattribute("data-wp-router-options")
      );
      return parsed?.loadonclientnavigation === true;
    } catch {
      return false;
    }
  }).map((script) => script.src);
  return moduleurls.filter((url) => !resolvedscriptmodules.has(url)).map((url) => preloadwithmap(url, importmap));
};
const importscriptmodules = (modules) => promise.all(modules.map((m) => importpreloadedmodule(m)));


;// ./node_modules/@wordpress/interactivity-router/build-module/index.js



const {
  getregionrootfragment,
  initialvdom,
  tovdom,
  render,
  parseserverdata,
  populateserverdata,
  batch,
  routerregions,
  h: createelement,
  navigationsignal
} = (0,interactivity_namespaceobject.privateapis)(
  "i acknowledge that using private apis means my theme or plugin will inevitably break in the next version of wordpress."
);
const regionattr = `data-wp-router-region`;
const interactiveattr = `data-wp-interactive`;
const regionsselector = `[${interactiveattr}][${regionattr}], [${interactiveattr}] [${interactiveattr}][${regionattr}]`;
const pages = /* @__pure__ */ new map();
const getpagepath = (url) => {
  const u = new url(url, window.location.href);
  return u.pathname + u.search;
};
const parseregionattribute = (region) => {
  const value = region.getattribute(regionattr);
  try {
    const { id, attachto } = json.parse(value);
    return { id, attachto };
  } catch (e) {
    return { id: value };
  }
};
const clonerouterregioncontent = (vdom) => {
  if (!vdom) {
    return vdom;
  }
  const allprioritylevels = vdom.props.prioritylevels;
  const routerregionlevel = allprioritylevels.findindex(
    (level) => level.includes("router-region")
  );
  const prioritylevels = routerregionlevel !== -1 ? allprioritylevels.slice(routerregionlevel + 1) : allprioritylevels;
  return prioritylevels.length > 0 ? createelement(vdom.type, {
    ...vdom.props,
    prioritylevels
  }) : vdom.props.element;
};
const regionstoattachbyparent = /* @__pure__ */ new weakmap();
const rootfragmentsbyparent = /* @__pure__ */ new weakmap();
const initialregionstoattach = /* @__pure__ */ new set();
const fetchpage = async (url, { html }) => {
  try {
    if (!html) {
      const res = await window.fetch(url);
      if (res.status !== 200) {
        return false;
      }
      html = await res.text();
    }
    const dom = new window.domparser().parsefromstring(html, "text/html");
    return await preparepage(url, dom);
  } catch (e) {
    return false;
  }
};
const preparepage = async (url, dom, { vdom } = {}) => {
  dom.queryselectorall("noscript").foreach((el) => el.remove());
  const regions = {};
  const regionstoattach = {};
  dom.queryselectorall(regionsselector).foreach((region) => {
    const { id, attachto } = parseregionattribute(region);
    if (region.parentelement.closest(`[${regionattr}]`)) {
      regions[id] = void 0;
    } else {
      regions[id] = vdom?.has(region) ? vdom.get(region) : tovdom(region);
    }
    if (attachto && !initialregionstoattach.has(id)) {
      regionstoattach[id] = attachto;
    }
  });
  const title = dom.queryselector("title")?.innertext;
  const initialdata = parseserverdata(dom);
  const [styles, scriptmodules] = await promise.all([
    promise.all(preloadstyles(dom, url)),
    promise.all(preloadscriptmodules(dom))
  ]);
  return {
    regions,
    regionstoattach,
    styles,
    scriptmodules,
    title,
    initialdata,
    url
  };
};
const renderpage = (page) => {
  applystyles(page.styles);
  const regionstoattach = { ...page.regionstoattach };
  batch(() => {
    populateserverdata(page.initialdata);
    navigationsignal.value += 1;
    routerregions.foreach((signal) => {
      signal.value = null;
    });
    const parentstoupdate = /* @__pure__ */ new set();
    for (const id in regionstoattach) {
      const parent = document.queryselector(regionstoattach[id]);
      if (!regionstoattachbyparent.has(parent)) {
        regionstoattachbyparent.set(parent, []);
      }
      const regions = regionstoattachbyparent.get(parent);
      if (!regions.includes(id)) {
        regions.push(id);
        parentstoupdate.add(parent);
      }
    }
    for (const id in page.regions) {
      if (routerregions.has(id)) {
        routerregions.get(id).value = clonerouterregioncontent(
          page.regions[id]
        );
      }
    }
    parentstoupdate.foreach((parent) => {
      const ids = regionstoattachbyparent.get(parent);
      const vdoms = ids.map((id) => page.regions[id]);
      if (!rootfragmentsbyparent.has(parent)) {
        const regions = vdoms.map(({ props, type }) => {
          const elementtype = typeof type === "function" ? props.type : type;
          const region = document.createelement(elementtype);
          parent.appendchild(region);
          return region;
        });
        rootfragmentsbyparent.set(
          parent,
          getregionrootfragment(regions)
        );
      }
      const fragment = rootfragmentsbyparent.get(parent);
      render(vdoms, fragment);
    });
  });
  if (page.title) {
    document.title = page.title;
  }
};
const forcepagereload = (href) => {
  window.location.assign(href);
  return new promise(() => {
  });
};
window.addeventlistener("popstate", async () => {
  const pagepath = getpagepath(window.location.href);
  const page = pages.has(pagepath) && await pages.get(pagepath);
  if (page) {
    batch(() => {
      state.url = window.location.href;
      renderpage(page);
    });
  } else {
    window.location.reload();
  }
});
document.queryselectorall(regionsselector).foreach((region) => {
  const { id, attachto } = parseregionattribute(region);
  if (attachto) {
    initialregionstoattach.add(id);
  }
});
window.document.queryselectorall("script[type=module][src]").foreach(({ src }) => markscriptmoduleasresolved(src));
pages.set(
  getpagepath(window.location.href),
  promise.resolve(
    preparepage(getpagepath(window.location.href), document, {
      vdom: initialvdom
    })
  )
);
let navigatingto = "";
let hasloadednavigationtextsdata = false;
const navigationtexts = {
  loading: "loading page, please wait.",
  loaded: "page loaded."
};
const { state, actions } = (0,interactivity_namespaceobject.store)("core/router", {
  state: {
    url: window.location.href,
    navigation: {
      hasstarted: false,
      hasfinished: false
    }
  },
  actions: {
    /**
     * navigates to the specified page.
     *
     * this function normalizes the passed href, fetches the page html if
     * needed, and updates any interactive regions whose contents have
     * changed. it also creates a new entry in the browser session history.
     *
     * @param href                               the page href.
     * @param [options]                          options object.
     * @param [options.force]                    if true, it forces re-fetching the url.
     * @param [options.html]                     html string to be used instead of fetching the requested url.
     * @param [options.replace]                  if true, it replaces the current entry in the browser session history.
     * @param [options.timeout]                  time until the navigation is aborted, in milliseconds. default is 10000.
     * @param [options.loadinganimation]         whether an animation should be shown while navigating. default to `true`.
     * @param [options.screenreaderannouncement] whether a message for screen readers should be announced while navigating. default to `true`.
     *
     * @return  promise that resolves once the navigation is completed or aborted.
     */
    *navigate(href, options = {}) {
      const { clientnavigationdisabled } = (0,interactivity_namespaceobject.getconfig)();
      if (clientnavigationdisabled) {
        yield forcepagereload(href);
      }
      const pagepath = getpagepath(href);
      const { navigation } = state;
      const {
        loadinganimation = true,
        screenreaderannouncement = true,
        timeout = 1e4
      } = options;
      navigatingto = href;
      actions.prefetch(pagepath, options);
      const timeoutpromise = new promise(
        (resolve) => settimeout(resolve, timeout)
      );
      const loadingtimeout = settimeout(() => {
        if (navigatingto !== href) {
          return;
        }
        if (loadinganimation) {
          navigation.hasstarted = true;
          navigation.hasfinished = false;
        }
        if (screenreaderannouncement) {
          a11yspeak("loading");
        }
      }, 400);
      const page = yield promise.race([
        pages.get(pagepath),
        timeoutpromise
      ]);
      cleartimeout(loadingtimeout);
      if (navigatingto !== href) {
        return;
      }
      if (page && !page.initialdata?.config?.["core/router"]?.clientnavigationdisabled) {
        yield importscriptmodules(page.scriptmodules);
        batch(() => {
          state.url = href;
          if (loadinganimation) {
            navigation.hasstarted = false;
            navigation.hasfinished = true;
          }
          renderpage(page);
        });
        window.history[options.replace ? "replacestate" : "pushstate"]({}, "", href);
        if (screenreaderannouncement) {
          a11yspeak("loaded");
        }
        const { hash } = new url(href, window.location.href);
        if (hash) {
          document.queryselector(hash)?.scrollintoview();
        }
      } else {
        yield forcepagereload(href);
      }
    },
    /**
     * prefetches the page with the passed url.
     *
     * the function normalizes the url and stores internally the fetch
     * promise, to avoid triggering a second fetch for an ongoing request.
     *
     * @param url             the page url.
     * @param [options]       options object.
     * @param [options.force] force fetching the url again.
     * @param [options.html]  html string to be used instead of fetching the requested url.
     *
     * @return  promise that resolves once the page has been fetched.
     */
    *prefetch(url, options = {}) {
      const { clientnavigationdisabled } = (0,interactivity_namespaceobject.getconfig)();
      if (clientnavigationdisabled) {
        return;
      }
      const pagepath = getpagepath(url);
      if (options.force || !pages.has(pagepath)) {
        pages.set(
          pagepath,
          fetchpage(pagepath, { html: options.html })
        );
      }
      yield pages.get(pagepath);
    }
  }
});
function a11yspeak(messagekey) {
  if (!hasloadednavigationtextsdata) {
    hasloadednavigationtextsdata = true;
    const content = document.getelementbyid(
      "wp-script-module-data-@wordpress/interactivity-router"
    )?.textcontent;
    if (content) {
      try {
        const parsed = json.parse(content);
        if (typeof parsed?.i18n?.loading === "string") {
          navigationtexts.loading = parsed.i18n.loading;
        }
        if (typeof parsed?.i18n?.loaded === "string") {
          navigationtexts.loaded = parsed.i18n.loaded;
        }
      } catch {
      }
    } else {
      if (state.navigation.texts?.loading) {
        navigationtexts.loading = state.navigation.texts.loading;
      }
      if (state.navigation.texts?.loaded) {
        navigationtexts.loaded = state.navigation.texts.loaded;
      }
    }
  }
  const message = navigationtexts[messagekey];
  promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 317)).then(
    ({ speak }) => speak(message),
    // ignore failures to load the a11y module.
    () => {
    }
  );
}


var __webpack_exports__actions = __webpack_exports__.o;
var __webpack_exports__state = __webpack_exports__.w;
export { __webpack_exports__actions as actions, __webpack_exports__state as state };





