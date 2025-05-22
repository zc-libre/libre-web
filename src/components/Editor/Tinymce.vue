<template>
  <Editor
    api-key="am62oxq56bsrjlkcpq458daf0z8g4x844mrni0qzsi3shkt9"
    :init="{
        height: 500,     // 设置高度
        width: '100%',
        base_url: '/tinymce',
        toolbar_mode: toolbarMode,
        external_plugins: externalPlugins,
        language_url: languageUrl,   //语言文件
        language: 'zh_CN',
        toolbar: toolbar,

        skin_url: '/tinymce/skins/ui/oxide',
        paste_data_images: pasteDataImages,
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
      }"
    :initial-value="initialValue"
  />
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'TinymceEditor',
  components: { Editor },
  props: {
    toolbarMode: {
      type: String,
      default: 'sliding'
    },
    languageUrl: {
      type: String,
      default: '/tinymce/lang/zh_CN.js'
    },
    fontFormats:
      "微软雅黑 = '微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
    branding: false,
    pasteDataImages: true,
    imageAdvtab: true,
    plugins: {
      type: Array,
      default() {
        return [
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
          'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
        ]
      }
    },
    externalPlugins: {
      anchor: '/tinymce/plugins/anchor/plugin.min.js',
      code: '/tinymce/plugins/code/plugin.min.js',
      print: '/tinymce/plugins/print/plugin.min.js',
      preview: '/tinymce/plugins/preview/plugin.min.js',
      searchreplace: '/tinymce/plugins/searchreplace/plugin.min.js',
      autolink: '/tinymce/plugins/autolink/plugin.min.js',
      directionality: '/tinymce/plugins/directionality/plugin.min.js',
      visualblocks: '/tinymce/plugins/visualblocks/plugin.min.js',
      visualchars: '/tinymce/plugins/visualchars/plugin.min.js',
      fullscreen: '/tinymce/plugins/fullscreen/plugin.min.js',
      image: '/tinymce/plugins/image/plugin.min.js',
      link: '/tinymce/plugins/link/plugin.min.js',
      media: '/tinymce/plugins/media/plugin.min.js',
      template: '/tinymce/plugins/template/plugin.min.js',
      codesample: '/tinymce/plugins/codesample/plugin.min.js',
      table: '/tinymce/plugins/table/plugin.min.js',
      charmap: '/tinymce/plugins/charmap/plugin.min.js',
      pagebreak: '/tinymce/plugins/pagebreak/plugin.min.js',
      nonbreaking: '/tinymce/plugins/nonbreaking/plugin.min.js',
      insertdatetime: '/tinymce/plugins/insertdatetime/plugin.min.js',
      advlist: '/tinymce/plugins/advlist/plugin.min.js',
      lists: '/tinymce/plugins/lists/plugin.min.js',
      wordcount: '/tinymce/plugins/wordcount/plugin.min.js',
      imagetools: '/tinymce/plugins/imagetools/plugin.min.js',
      textpattern: '/tinymce/plugins/textpattern/plugin.min.js',
      help: '/tinymce/plugins/help/plugin.min.js',
      emoticons: '/tinymce/plugins/emoticons/plugin.min.js',
      autosave: '/tinymce/plugins/autosave/plugin.min.js',
      iframe: '/tinymce/plugins/iframe/plugin.min.js',
      hr: '/tinymce/plugins/hr/plugin.min.js'
      // formatpainter: "/tinymce/plugins/formatpainter/plugin.min.js",
    },

    toolbar: {
      type: String,
      default: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat'
    },
    initialValue: {
      type: String,
      default: 'Welcome to TinyMCE!'
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped></style>
