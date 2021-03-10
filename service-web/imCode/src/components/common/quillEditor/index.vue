<template>
  <div class>
    <!-- <el-form-item label="项目简介"> -->
    <div v-loading="imageLoading" element-loading-text="请稍等，图片上传中">
      <!-- <quill-editor ref="newEditor" v-model="form.intro"></quill-editor> -->
      <quill-editor ref="newEditor" v-model="content" :options="editorOption" @change="onChange"></quill-editor>
      <!-- 文件上传input 将它隐藏-->
      <el-upload
        style="display:none"
        :action="apiurl"
        :headers="headers"
        :show-file-list="false"
        :before-upload="newEditorbeforeupload"
        :on-success="newEditorSuccess"
        ref="uniqueId"
        id="uniqueId"
      ></el-upload>
    </div>
    <!-- </el-form-item> -->
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  //import引入的组件需要注入到对象中才能使用
  // name: "quillEditor",
  components: {
    quillEditor
  },
  props: {
      contentP: {
          type: String,
          default: ""
      }
  },
  data() {
    //这里存放数据
    return {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
      },
      content: "",
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            // ["blockquote", "code-block"],
            // [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            // [{ size: ["small", false, "large", "huge"] }],
            // [{ header: [1, 2, 3, 4, 5, 6, false] }],
            // [{ color: [] }, { background: [] }],
            // [{ align: [] }],
            // ["clean"],
            ["link", "image"]
            // ["image"]
          ]
        }
      },
      imageLoading: false,
      apiurl: this.$httpServer.im_fdfsupload
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    onChange() {
      this.$emit("inputContent", this.content);
    },
    newEditorbeforeupload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      if (isJPG && isLt2M) this.imageLoading = true;
      return isJPG && isLt2M;
    },
    //上传图片回调
    newEditorSuccess(response, file, fileList) {
      if (response.code == "0") {
        // this.content = response.data;
        this.addImgRange = this.$refs.newEditor.quill.getSelection();
        let length = this.$refs.newEditor.quill.selection.savedRange.index;
        this.$refs.newEditor.quill.insertEmbed(length, "image", response.data);
        this.$refs.newEditor.quill.setSelection(length + 1);
      }
      this.imageLoading = false;
	}
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.content = this.contentP;
    var imgHandler = async function(state) {
      if (state) {
        var fileInput = document.querySelector("#uniqueId input"); //隐藏的file元素
        fileInput.click(); //触发事件
      }
    };
    this.$refs.newEditor.quill
      .getModule("toolbar")
	  .addHandler("image", imgHandler);
	setTimeout( ()=>{
		this.$refs.newEditor.quill.setSelection(9999);
	},100)
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="less" scoped>
/*VueEditor*/
/deep/ .quill-editor {
  font-style:inherit;
  border: none;
  background: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
  z-index: 112;
}
/deep/ .ql-editor{
  height:175px;
}
/deep/ .ql-editor strong{
  font-weight: bold;
}
/deep/ .ql-editor em{
  font-style: oblique;
}
/deep/ .ql-toolbar.ql-snow {
  border: none;
}
/deep/ .ql-toolbar.ql-snow {
  border-bottom: 1px solid rgba(52, 63, 75, 0.07);
}
/deep/ .ql-container.ql-snow {
  border: none;
}
/deep/ .ql-container.ql-snow .ql-tooltip {
  left: 0 !important;
}
/deep/ .ql-container {
  min-height: 175px;
}
/deep/ .ql-snow.ql-tooltip {
  transform: translateX(117.5px) translateY(10px);
  left: 0 !important;
}
/deep/ .ql-tooltip.ql-editing {
  left: 0 !important;
  width: 100%;
  // z-index: 111 !important;
}
/deep/ .ql-snow .ql-tooltip a.ql-preview {
  max-width: 67px;
}
/deep/ .ql-formats button {
  color: #969fb2;
}
/deep/ .editor-btn {
  margin-top: 20px;
}
/deep/ .ql-stroke {
  color: #ccc !important;
}
/deep/ .ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "链接地址:";
}
/deep/ .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  content: "保存";
}
/deep/ .ql-snow .ql-tooltip::before {
  content: "访问URL:";
}
/deep/ .ql-snow .ql-tooltip input[type="text"] {
  width: 110px;
}
/deep/ .ql-snow .ql-tooltip a.ql-action::after {
  content: "编辑";
}
/deep/ .ql-snow .ql-tooltip a.ql-remove::before {
  content: "删除";
}
</style>
