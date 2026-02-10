<script setup lang="ts"></script>

<template>
  <RouterView />
</template>

<style>
html,body,*{
  margin:0;
  padding:0;
  font-family:"Microsoft YaHei", "SimSun";
}
html,body{
  height:100%;
}
body{
  background:#f6f5f5;
  font-size:16px;
}
a{
  text-decoration:none;
  outline:none;
}
img{
  border:none;
  outline:none;
  width:100%;
}
input,button{
  outline: none;
}
.pay_tips{
  text-align: center;
  padding: 20px 0 22px;
}
.pay_tips p{
  line-height: 1.5;
  padding: 3px 0;
}
.pay_tips p span{
  color: #DC0000;
}
</style>
