// Generated by CoffeeScript 1.12.7
(function() {
  define(function(require) {
    var exports, querystring, tough, url;
    require('/static/node_components');
    RegExp.escape = function(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    url = node_url;
    tough = node_tough;
    querystring = node_querystring;
    exports = {
      cookie_parse: function(cookie_string) {
        var cookie, each, i, index, key, len, ref, value;
        cookie = {};
        ref = cookie_string != null ? cookie_string.split(';') : void 0;
        for (i = 0, len = ref.length; i < len; i++) {
          each = ref[i];
          index = each.indexOf('=');
          index = index < 0 ? each.length : index;
          key = each.slice(0, +index + 1 || 9e9);
          value = each.slice(index + 1);
          cookie[decodeURIComponent(key)] = decodeURIComponent(value);
        }
        return cookie;
      },
      cookie_unparse: function(cookie) {
        var key, value;
        return ((function() {
          var i, len, results;
          results = [];
          for (value = i = 0, len = cookie.length; i < len; value = ++i) {
            key = cookie[value];
            results.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
          }
          return results;
        })()).join(';');
      },
      url_parse: node_url.parse,
      url_unparse: node_url.format,
      querystring_parse: node_querystring.parse,
      querystring_unparse: node_querystring.stringify,
      querystring_unparse_with_variables: function(obj) {
        var key, m, query, re, replace_list, value;
        query = node_querystring.stringify(obj);
        replace_list = {};
        for (key in obj) {
          value = obj[key];
          re = /{{\s*([\w]+)[^}]*?\s*}}/g;
          while (m = re.exec(key)) {
            if (m[0].slice(-12) !== '|urlencode}}') {
              replace_list[encodeURIComponent(m[0])] = m[0].slice(0, -2) + '|urlencode}}';
            } else {
              replace_list[encodeURIComponent(m[0])] = m[0];
            }
          }
          re = /{{\s*([\w]+)[^}]*?\s*}}/g;
          while (m = re.exec(value)) {
            if (m[0].slice(-12) !== '|urlencode}}') {
              replace_list[encodeURIComponent(m[0])] = m[0].slice(0, -2) + '|urlencode}}';
            } else {
              replace_list[encodeURIComponent(m[0])] = m[0];
            }
          }
        }
        if (node_querystring.stringify(replace_list)) {
          console.log('The replace_list is', replace_list);
        }
        for (key in replace_list) {
          value = replace_list[key];
          query = query.replace(new RegExp(RegExp.escape(key), 'g'), value);
        }
        return query;
      },
      querystring_parse_with_variables: function(query) {
        var _query, key, m, re, replace_list, value;
        replace_list = {};
        re = /{{\s*([\w]+)[^}]*?\s*\|urlencode}}/g;
        _query = decodeURIComponent(query);
        while (m = re.exec(_query)) {
          replace_list[encodeURIComponent(m[0])] = m[0].slice(0, -12) + '}}';
        }
        for (key in replace_list) {
          value = replace_list[key];
          query = query.replace(new RegExp(RegExp.escape(key), 'g'), value);
        }
        return exports.querystring_parse(query);
      },
      CookieJar: node_tough.CookieJar,
      Cookie: node_tough.Cookie,
      dict2list: function(dict) {
        var k, results, v;
        results = [];
        for (k in dict) {
          v = dict[k];
          results.push({
            name: k,
            value: v
          });
        }
        return results;
      },
      list2dict: function(list) {
        var dict, each, i, len;
        dict = {};
        if (list) {
          for (i = 0, len = list.length; i < len; i++) {
            each = list[i];
            dict[each.name] = each.value;
          }
        }
        return dict;
      },
      get_public_suffix: node_tough.getPublicSuffix,
      get_domain: function(url) {
        return exports.get_public_suffix(exports.url_parse(url).hostname);
      },
      debounce: function(func, wait, immediate) {
        var later, timeout, timestamp;
        timestamp = 0;
        timeout = 0;
        later = function() {
          var args, context, last, result;
          last = (new Date().getTime()) - timestamp;
          if ((0 < last && last < wait)) {
            return timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
              if (!timeout) {
                return context = args = null;
              }
            }
          }
        };
        return function() {
          var args, callNow, context, result;
          context = this;
          args = arguments;
          timestamp = new Date().getTime();
          callNow = immediate && !timeout;
          if (!timeout) {
            timeout = setTimeout(later, wait);
          }
          if (callNow) {
            result = func.apply(context, args);
            context = args = null;
          }
          return result;
        };
      },
      storage: {
        set: function(key, value) {
          var error;
          if (window.localStorage == null) {
            return false;
          }
          try {
            return window.localStorage.setItem(key, angular.toJson(value));
          } catch (error1) {
            error = error1;
            return null;
          }
        },
        get: function(key) {
          var error;
          if (window.localStorage == null) {
            return null;
          }
          try {
            return angular.fromJson(window.localStorage.getItem(key));
          } catch (error1) {
            error = error1;
            return null;
          }
        },
        del: function(key) {
          var error;
          if (window.localStorage == null) {
            return false;
          }
          try {
            return window.localStorage.removeItem(key);
          } catch (error1) {
            error = error1;
            return null;
          }
        }
      },
      tpl2har: function(tpl) {
        var en, x;
        return {
          log: {
            creator: {
              name: 'binux',
              version: 'qiandao'
            },
            entries: (function() {
              var i, len, ref, ref1, ref2, results;
              results = [];
              for (i = 0, len = tpl.length; i < len; i++) {
                en = tpl[i];
                results.push({
                  comment: en.comment,
                  checked: true,
                  startedDateTime: (new Date()).toISOString(),
                  time: 1,
                  request: {
                    method: en.request.method,
                    url: en.request.url,
                    headers: (function() {
                      var j, len1, ref, results1;
                      ref = en.request.headers || [];
                      results1 = [];
                      for (j = 0, len1 = ref.length; j < len1; j++) {
                        x = ref[j];
                        results1.push({
                          name: x.name,
                          value: x.value,
                          checked: true
                        });
                      }
                      return results1;
                    })(),
                    queryString: [],
                    cookies: (function() {
                      var j, len1, ref, results1;
                      ref = en.request.cookies || [];
                      results1 = [];
                      for (j = 0, len1 = ref.length; j < len1; j++) {
                        x = ref[j];
                        results1.push({
                          name: x.name,
                          value: x.value,
                          checked: true
                        });
                      }
                      return results1;
                    })(),
                    headersSize: -1,
                    bodySize: en.request.data ? en.request.data.length : 0,
                    postData: {
                      mimeType: en.request.mimeType,
                      text: en.request.data
                    }
                  },
                  response: {},
                  cache: {},
                  timings: {},
                  connections: "0",
                  pageref: "page_0",
                  success_asserts: (ref = en.rule) != null ? ref.success_asserts : void 0,
                  failed_asserts: (ref1 = en.rule) != null ? ref1.failed_asserts : void 0,
                  extract_variables: (ref2 = en.rule) != null ? ref2.extract_variables : void 0
                });
              }
              return results;
            })(),
            pages: [],
            version: '1.2'
          }
        };
      }
    };
    return exports;
  });

}).call(this);
