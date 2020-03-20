<template>
  <div class="file-content">
    <div class="file-th">
      <span class="name">文件名</span>
      <span class="size">文件大小</span>
      <span class="num">下载次数</span>
      <span class="time">上传时间</span>
    </div>
    <div v-for="item of tableData" :key="item.fileId">
      <span>{{item.fileName}}</span>
      <span>{{item.fileSize}}</span>
      <span>{{item.num}}</span>
      <span>{{item.createTime}}</span>
      <span @click="download(item)">下载</span>
    </div>
  </div>
</template>

<script>
  import {
    ajaxReq,ajaxDown
  } from '../util/axios.js'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        tableData: []
      }
    },
    mounted() {
      this.getLoginInfo()
      setTimeout(()=> {
        this.getList()
      },2000)
    },
    methods: {
      getLoginInfo() {
        ajaxReq(
          "/user/login", {
            account: 'admin',
            password: 'admin123456'
          },
          (state, rspMsg, rspData) => {
            if (state == "FAIL" || state == "ERROR") {
              return;
            }
            if (state == "SUCCESS") {
              sessionStorage.setItem("userToken", rspData.userToken);
              console.log(rspData)
            }
          }
        );
      },
      getList() {
        ajaxReq(
          "/netDisk/selectChildFoldersAndFiles", {
            folderId: "cd2fda0d6cca4ea2b1cc3ec931349337"
          },
          (state, rspMsg, rspData) => {
            if (state == "FAIL" || state == "ERROR") {
              return;
            }
            if (state == "SUCCESS") {
              this.tableData = rspData.files
              console.log(rspData)
            }
          }
        );
      },
      download(item) {
        ajaxDown(
          "/netDisk/downloadFile", {
            fileId: item.fileId,
            fileName: item.fileName
          },
          (state, rspMsg, rspData) => {
            if (state == "FAIL" || state == "ERROR") {
              return;
            }
            if (state == "SUCCESS") {
              console.log(rspData)
            }
          }
        );
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .file-content {
    
  }
 .file-th {}
</style>
