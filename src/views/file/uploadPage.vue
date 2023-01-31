<template>
    <el-card style="width: 80%; margin: 80px auto" header="文件分片上传">
         <el-upload
            class="upload-demo"
            drag
            action="/"
            multiple
            :http-request="handleHttpRequest"
            :on-remove="handleRemoveFile">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                请拖拽文件到此处或 <em>点击此处上传</em>
            </div>
        </el-upload>
    </el-card>
</template>

<script>
</script>
