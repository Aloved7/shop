<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        placeholder="重量(克)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        type="textarea"
        placeholder="SKU描述"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attIdAndValueId">
            <el-option
              :value="`${item.id}:${iteminner.id}`"
              v-for="(iteminner, index) in item.attrValueList"
              :key="iteminner.id"
              :label="iteminner.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          :label="item.saleAttrName"
          v-for="(item, index) in saleArr"
          :key="item.id"
        >
          <el-select v-model="item.saleIdAndValue">
            <el-option
              :value="`${item.id}:${iteminner.id}`"
              :label="iteminner.saleAttrValueName"
              v-for="(iteminner, index) in item.spuSaleAttrValueList"
              :key="iteminner.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="handleClick(row)"
              >设置默认</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button size="default" @click="cancal">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
//引入请求平台属性的接口
import { reqArr } from "@/api/product/attr/index";
//引入图片列表的接口
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from "@/api/product/spu/index";
import { SkuData } from "@/api/product/spu/type";
import { ElMessage } from "element-plus";

let $emits = defineEmits(["changeScene"]);
//触发自定义事件控制场景切换  取消的回调
const cancal = () => {
  $emits("changeScene", { flag: 0, params: "" });
};
//设置默认图片的回调
const handleClick = (row: any) => {
  // console.log(table.value,'@@@@@@@@@@@@');
  //获取了img对应table的实例 就可以调用实例方法 复选框选中方法
  //一上来就让组件内部的复选全不选 然后点击的选中
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false);
  });
  table.value.toggleRowSelection(row, true);

  //收集默认图片的地址
  skuParams.skuDefaultImg = row.imgUrl;
};

//定义存储相应接口返回数据的变量
//接收平台属性
let attrArr = ref<any>([]);
//已有spu的所有销售属性
let saleArr = ref<any>([]);
//已有spu照片墙
let imgArr = ref<any>([]);
//收集sku数据然后发送给服务器
let skuParams = reactive<SkuData>({
  //父组件传递来的数据
  category3Id: "",
  spuid: "",
  tmId: "", //品牌id
  //v-model 收集的数据
  skuName: "", //sku的名字
  price: "", //sku的价格
  weight: "", //sku的重量
  skuDesc: "", //sku的描述
  skuDefaultImg: "", //默认图片
  skuAttrValueList: [
    //平台属性的收集
  ],
  skuSaleAttrValueList: [
    //销售属性的收集
  ],
});
//获取img组件的vc实例
let table = ref<any>();

//定义一个初始化请求方法 共父组件调用
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string, //参数
  spu: any
) => {
  //收集三级分类id
  skuParams.category3Id = spu.category3Id;
  skuParams.spuid = spu.id;
  skuParams.tmId = spu.tmId;
  //获取平台属性需要三个id
  let res: any = await reqArr(c1Id, c2Id, spu.category3Id);
  attrArr.value = res.data;
  //获取对应的销售属性
  let res2: any = await reqSpuHasSaleAttr(spu.id);
  saleArr.value = res2.data;
  //获取已有spu的照片墙数据
  let res3: any = await reqSpuImageList(spu.id);
  imgArr.value = res3.data;
};

//定义保存按钮方法
const save = async () => {
  //整理数据
  //1. 平台属性
  let arr = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attIdAndValueId) {
      let [attrId, valueId] = next.attIdAndValueId.split(":");
      // console.log(attrId, valueId);
      prev.push({
        attrId,
        valueId,
      });
    }
    return prev;
  }, []);
  skuParams.skuAttrValueList = arr;
  //2.销售属性
  let arr1 = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValue) {
      let [saleAttrId, saleAttrValueUd] = next.saleIdAndValue.split(":");
      prev.push({
        saleAttrId,
        saleAttrValueUd,
      });
    }
    return prev;
  }, []);
  skuParams.skuAttrValueList = arr1;
  //发送请求
  let res = await reqAddSku(skuParams);
  console.log(res);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "添加成功",
    });
    //切换场景
    $emits("changeScene", { flag: 0, params: "" });
  } else {
    ElMessage({
      type: "error",
      message: "添加失败",
    });
  }
};

defineExpose({
  initSkuData,
});
</script>

<style scoped></style>
