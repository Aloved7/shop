<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请你输入SPU的名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU的品牌">
      <el-select v-model="SpuParams.tmId">
        <!-- 将选择的品牌id 收集起来 用于发送请求 -->
        <el-option
          v-for="(item, index) in allTardeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图标">
      <!-- 
            fileList 展示默认图片
            list-type 图片列表的展示类型
            on-preview 点击预览图标的时候触发的事件 会自动注入当前文件对象
         -->
      <el-upload
        v-model:file-list="imageList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性 -->
      <el-select
        v-model="saleAttrIdAndName"
        :placeholder="
          unSelectSaleAttr.length
            ? `您还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <el-option
          v-for="(item, inbex) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
        <!-- 加冒号的作用就是将两个变量隔开 -->
      </el-select>
      <el-button
        :disabled="saleAttrIdAndName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSaleAttr"
        >添加属性</el-button
      >
      <!-- table 展示销售属性和值 -->
      <el-table border style="margin: 10px 0" :data="hasSaleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row 当前已有的销售属性对象 -->
          <template #="{ row, $index }">
            <el-tag
              style="margin: 0 5px"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              class="mx-1"
              closable
              @close="row.spuSaleAttrValueList.splice(index)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag === true"
              size="small"
              style="width: 100px"
              placeholder="请输入属性值"
              v-model="row.saleAttrValue"
              @blur="toLook(row)"
            ></el-input>
            <el-button
              @click="editAttr(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template #="{ row, $index }">
            <!-- 点击删除按钮后根据下标将 当前属性值删除 -->
            <el-button
              type="warning"
              size="small"
              icon="Delete"
              @click="hasSaleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button
        type="primary"
        @click="save"
        :disabled="hasSaleAttr.length > 0 ? false : true"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqAddOrUpdateSpu } from "@/api/product/spu/index";
import { ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";
import { spuData } from "@/api/product/spu/type";
import { ref, computed } from "vue";
import {
  reqAllTrademark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from "@/api/product/spu/index";
import {
  AllTardeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSale,
  SaleAttrValue,
} from "@/api/product/spu/type";
let $emit = defineEmits(["changeScene"]);
//子组件点击取消按钮 切换场景
const cancel = () => {
  $emit("changeScene", { flag: 0, params: "update" });
};

//存储已有的spu数据
let allTardeMark = ref<Trademark[]>([]);
let imageList = ref<SpuImg[]>([]);
let hasSaleAttr = ref<SaleAttr[]>([]); //已有的spu属性
let allSaleAttr = ref<HasSale[]>([]);

//负责存储和展示 已有spu对象  同时页负责添加新spu
let SpuParams = ref<spuData>({
  category3Id: "", //三级分类的id
  spuName: "", //新增或者修改的spu名字
  description: "", //spu的描述
  tmId: "", //品牌的id
  spuImageList: [],
  spuSaleAttrList: [],
});
//控制对话框的显示和隐藏
let dialogVisible = ref<boolean>(false);
//存储预览图片‘
let dialogImageUrl = ref<string>("");

//收集还未选择的销售属性的id和名字
let saleAttrIdAndName = ref<string>("");

//子组件定义方法用来接收参数
const initHasSpuData = async (spu: spuData) => {
  //存储已有spu对象
  SpuParams.value = spu;
  //   console.log(spu);  //父组件传递进来的 已有spu对象[不完整]
  //1.获取全部品牌的数据
  let res: AllTardeMark = await reqAllTrademark();
  allTardeMark.value = res.data;
  //获取某一个商品对应的图片列表
  let res1: SpuHasImg = await reqSpuImageList(spu.id as number);
  //对图片数组进行修改 能让他更改好的兼容 elemen提供的 约束UploadUserFile name和url
  imageList.value = res1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    };
  });
  //获取已有spu的销售属性
  let res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number);
  hasSaleAttr.value = res2.data;
  //获取所有的销售属性
  let res3: HasSaleAttrResponseData = await reqAllSaleAttr();
  allSaleAttr.value = res3.data;
};

//照片墙点击预览触发的事件
const handlePictureCardPreview = (file: any) => {
  //   console.log(file,'@@@@@@@@'); 会自动注入当前文件对象
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
//照片墙删除图片钩子函数
const handleRemove = () => {
  console.log(1);
};
//文件上传前调用的钩子函数
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // console.log(rawFile); //上传当前文件的对象 对上传的文件进行约束和限制
  if (
    rawFile.type === "image/png" ||
    rawFile.type === "image/jpeg" ||
    rawFile.type === "image/gif"
  ) {
    if (rawFile.size / 10247 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "文件上传大小小于4M",
      });
    }
  } else {
    ElMessage({
      type: "error",
      message: "文件上传格式务必是PNG|JPEG|GIF",
    });
    return false;
  }
};

//通过全部的销售属性和每个spu对象的已有销售属性 计算出新的属性
let unSelectSaleAttr = computed(() => {
  //全部销售属性
  let arr = allSaleAttr.value.filter((item) => {
    //every 接收一个回调函数 函数返回布尔值
    return hasSaleAttr.value.every((item1) => {
      return item.name !== item1.saleAttrName;
    });
  });
  return arr;
});

//添加销售属性的方法
const addSaleAttr = () => {
  /*
    baseSaleAttrId: number 属性id
    saleAttrName: string //对应的属性名字
    spuSaleAttrValueList: spuSaleAttrValueList 属性值数组
  */

  //对收集的数据进行结构获取id和name
  let [baseSaleAttrId, saleAttrName] = saleAttrIdAndName.value.split(":");
  //准备新数组 然后给SpuParams
  let newArr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  };
  //追加 已有的销售属性中
  hasSaleAttr.value.push(newArr);
  //清空 下拉列表里的数据
  saleAttrIdAndName.value = "";
};

//给每一个已有销售属性 动态添加一个标志 来控制查看与编辑的切换
const editAttr = (row: SaleAttr) => {
  // alert(123)
  //点击按钮的时候input 展示
  row.flag = true;
  //用来获取属性值
  row.saleAttrValue = "";
};

//失球焦点
const toLook = (row: SaleAttr) => {
  // console.log(row);  将获取的id和添加的销售属性值提取出来
  const { baseSaleAttrId, saleAttrValue } = row;
  //整理成服务器需要的数据
  let newSaleAttrValue: SaleAttrValue = {
    //这个就是属性值数组
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  };

  //非法1 添加属性值为空
  if ((saleAttrValue as string).trim() === "") {
    ElMessage({
      type: "error",
      message: "属性值不能为空",
    });
    return;
  }

  //非法2 属性值相同
  let res = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === saleAttrValue;
    //判断能不能找到属性值相同的
  });

  if (res) {
    ElMessage({
      type: "error",
      message: "属性值不能相同",
    });
    return;
  }

  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue);
  //切换查看与编辑
  row.flag = false;
};

//发送修改请求
const save = async () => {
  //首先整理数据
  //1.照片墙的数据
  SpuParams.value.spuImageList = imageList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    };
  });
  //2.整理销售属性
  SpuParams.value.spuSaleAttrList = hasSaleAttr.value;
  //发送请求
  let res = await reqAddOrUpdateSpu(SpuParams.value);
  // console.log(res,'@@@@@');
  if (res.code === 200) {
    //成功
    ElMessage({
      type: "success",
      message: SpuParams.value.id ? "修改成功" : "添加成功",
    });
    //成功后 通知父组件切换场景  并且通知父亲 重新获取请求
    // $emit("changeScene", 0);
    //目前是 修改添加都会到第一页 但是 父组件必须区分 是修改还是添加 所以将传值改为参数
    $emit("changeScene", {
      flag: 0,
      params: SpuParams.value.id ? "update" : "add",
    });
  } else {
    //失败
    ElMessage({
      type: "error",
      message: SpuParams.value.id ? "修改失败" : "添加失败",
    });
  }
};

//添加一个新的spu初始化方法  需要对外暴露
const initAddSpu = async (id: number | string) => {
  //清空数据 因为变量没有被删除
  Object.assign(SpuParams.value, {
    category3Id: "", //三级分类的id
    spuName: "", //新增或者修改的spu名字
    description: "", //spu的描述
    tmId: "", //品牌的id
    spuImageList: [],
    spuSaleAttrList: [],
  });
  //清空照片墙和已有属性
  imageList.value = [];
  hasSaleAttr.value = [];
  //清空销售属性
  saleAttrIdAndName.value = "";

  //存储父组件传下来的c3Id
  SpuParams.value.category3Id = id;
  // console.log("添加spu");
  //获取全部品牌的数据和全部销售属性的数据 并存储
  let res: AllTardeMark = await reqAllTrademark();
  let res2: HasSaleAttrResponseData = await reqAllSaleAttr();
  allTardeMark.value = res.data;
  allSaleAttr.value = res2.data;
};

//但是 使用setup语法糖写代码 默认是不对外暴露  也就是说 父组件本身拿不到 必须对外暴露
defineExpose({ initHasSpuData, initAddSpu });
</script>

<style scoped></style>
