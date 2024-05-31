import { get } from 'svelte/store'
import { user_language } from './bce_stores.js'

let bce_language_dictionary = {
  "en": {
    "bce": "BCE: the brain computer enterprises"
  },
  "es": {
    "bce": "BCE: las empresas de computadoras cerebrales"
  },
  "ja": {
    "bce": "BCE: ブレイン・コンピュータ・エンタープライズ"
  },
};

function get_user_language() {
    if (get(user_language) == "") {
    }

}

export const get_system_default_language = function() {
    var navigator_language = "en";
    if (navigator.languages != undefined) {
        navigator_language = navigator.languages[0];
    } else {
        navigator_language = navigator.language;
    }
    console.log("navigator_language = \"" + navigator_language + "\"");
    return navigator_language;
}

export const bce_lang = function (key) {
    let user_language = get_user_language();
    let language_dictionary = bce_language_dictionary[user_language][key];
    return language_dictionary;
}

