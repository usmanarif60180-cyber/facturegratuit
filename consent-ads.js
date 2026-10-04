(function () {
  "use strict";

  var CONSENT_KEY = "facturepro-cookie-consent";
  var ADSENSE_CLIENT = "ca-pub-4956341710070686";
  var GA_ID = "G-JJCNL9THWD";

  function readConsent() {
    try { return localStorage.getItem(CONSENT_KEY) || ""; }
    catch (error) { return ""; }
  }

  function addScript(id, src, attrs) {
    if (document.getElementById(id)) return;
    var script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = src;
    Object.keys(attrs || {}).forEach(function (key) { script.setAttribute(key, attrs[key]); });
    document.head.appendChild(script);
  }

  function loadOptionalServices() {
    if (readConsent() !== "accepted") return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "update", { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: true });
    addScript("profacture-gtag", "https://www.googletagmanager.com/gtag/js?id=" + GA_ID);
    addScript("profacture-adsense", "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_CLIENT, { crossorigin: "anonymous" });
    document.documentElement.setAttribute("data-adsense-ready", "true");
  }

  function saveConsent(choice) {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch (error) { /* Private mode may block storage. */ }
    var banner = document.getElementById("profacture-cookie-banner");
    if (banner) banner.remove();
    if (choice === "accepted") loadOptionalServices();
    document.dispatchEvent(new CustomEvent("profacture:consentchange", { detail: { choice: choice } }));
  }

  function showBanner() {
    if (readConsent() || document.getElementById("profacture-cookie-banner")) return;
    var banner = document.createElement("section");
    banner.id = "profacture-cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML = '<div><strong>Cookies & privacy</strong><p>Essential storage keeps the service working. Analytics and Google advertising load only after your permission.</p></div>' +
      '<div class="profacture-consent-actions"><button type="button" data-consent="essential">Essential only</button><button type="button" class="primary" data-consent="accepted">Accept optional cookies</button></div>';
    banner.addEventListener("click", function (event) {
      var button = event.target.closest("[data-consent]");
      if (button) saveConsent(button.getAttribute("data-consent"));
    });
    document.body.appendChild(banner);
  }

  var style = document.createElement("style");
  style.textContent = "#profacture-cookie-banner{position:fixed;z-index:10000;left:16px;right:16px;bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:18px;max-width:1080px;margin:auto;padding:16px 18px;border:1px solid #d9dee8;border-radius:8px;background:#fff;color:#182033;box-shadow:0 18px 60px rgba(15,23,42,.2);font:14px/1.45 system-ui,sans-serif}#profacture-cookie-banner strong{font-size:15px}#profacture-cookie-banner p{margin:4px 0 0;max-width:720px;color:#586174}.profacture-consent-actions{display:flex;gap:8px;flex-wrap:wrap}.profacture-consent-actions button{min-height:40px;padding:8px 13px;border:1px solid #cbd2df;border-radius:6px;background:#fff;color:#182033;font-weight:700;cursor:pointer}.profacture-consent-actions .primary{border-color:#4f46e5;background:#4f46e5;color:#fff}@media(max-width:700px){#profacture-cookie-banner{align-items:stretch;flex-direction:column}.profacture-consent-actions button{flex:1}}";
  document.head.appendChild(style);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", wait_for_update: 500 });
  window.profactureConsent = { read: readConsent, save: saveConsent, loadOptionalServices: loadOptionalServices };
  window.profactureTrack = function (name, params) {
    if (readConsent() !== "accepted" || typeof window.gtag !== "function") return;
    window.gtag("event", name, Object.assign({ app_version: "2026.09" }, params || {}));
  };

  if ("PerformanceObserver" in window) {
    var vitals = { lcp: 0, cls: 0, inp: 0 };
    var observers = [];
    var vitalsReported = false;
    function observe(type, callback, options) {
      try {
        var observer = new PerformanceObserver(function (list) { list.getEntries().forEach(callback); });
        observer.observe(Object.assign({ type: type, buffered: true }, options || {}));
        observers.push(observer);
      } catch (error) { /* Unsupported metric on this browser. */ }
    }
    observe("largest-contentful-paint", function (entry) { vitals.lcp = entry.startTime; });
    observe("layout-shift", function (entry) { if (!entry.hadRecentInput) vitals.cls += entry.value; });
    observe("event", function (entry) { vitals.inp = Math.max(vitals.inp, entry.duration || 0); }, { durationThreshold: 40 });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "hidden" || vitalsReported) return;
      vitalsReported = true;
      observers.forEach(function (observer) { observer.takeRecords().forEach(function (entry) {
        if (entry.entryType === "largest-contentful-paint") vitals.lcp = entry.startTime;
        if (entry.entryType === "layout-shift" && !entry.hadRecentInput) vitals.cls += entry.value;
        if (entry.entryType === "event") vitals.inp = Math.max(vitals.inp, entry.duration || 0);
      }); });
      if (vitals.lcp) window.profactureTrack("web_vital_lcp", { value: Math.round(vitals.lcp), metric_unit: "ms" });
      if (vitals.cls) window.profactureTrack("web_vital_cls", { value: Math.round(vitals.cls * 1000), metric_unit: "score_x1000" });
      if (vitals.inp) window.profactureTrack("web_vital_interaction_max", { value: Math.round(vitals.inp), metric_unit: "ms" });
    });
  }

  function init() {
    loadOptionalServices();
    showBanner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
