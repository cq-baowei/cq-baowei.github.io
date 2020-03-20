import axios from 'axios'
import router from '.././router'
import Vue from 'vue'
const v = new Vue({});
var instance = axios.create();
	var REQ_URL= 'http://222.217.61.68:8888/pms/api/v1';
	var REQ_URL= 'http://222.217.61.68:8888/pms-admin/api/v1';


/***axios请求拦截**/
instance.interceptors.request.use(config => {
	var token = sessionStorage.getItem("userToken");
	if (token != null && token != '' && typeof token != 'undefined') {
		config.headers['H-User-Token'] = token;
	}
  // config.headers['Content-Security-Policy'] = 'upgrade-insecure-requests';
	return config;
}, error => { });

/***axios响应拦截**/
instance.interceptors.response.use(response => {
	return response.data;
}, error => { });

const ajaxReq = (url, reqData, fn) => {
	let sendData = {
		"appId": "admin-web",
		"signType": "signType",
		"sign": "sign",
		"reqTime": (new Date()).getTime(),
		"method": "method",
		reqData: reqData
	}
	instance.post(REQ_URL + url, sendData).then(response => {
		if (typeof response == 'undefined') {
			fn('FAIL', '请求失败！');
		} else {
			if (response.rspCode == '03') {
				//				v.$Message.error("Token需要续期")
				ajaxToken(url, reqData, fn);
			} else if (response.rspCode == '02') {
				v.$Message.error(response.rspMessage)
				router.push("/");
			} else if (response.rspCode == '00') {
				fn('SUCCESS', response.rspMessage, response.rspData)
			} else {
				fn('ERROR', response.rspMessage)
			}
		}
	}).catch(error => {
		console.log(error);
		fn('ERROR', '程序错误')
	});
}


function ajaxToken(url, reqData, fn) {
	let sendData = {
		"appId": "admin-web",
		"signType": "signType",
		"sign": "sign",
		"reqTime": (new Date()).getTime(),
		"method": "method",
		reqData: {}
	}
	instance.post(REQ_URL + "/token/tokenExtension", sendData).then(response => {
		if (typeof response == 'undefined') {
			//跳登录页
			router.push("/");
			v.$Message.error("Token续期失败")
		} else {
			if (response.rspCode == '00') {
				sessionStorage.setItem("userToken", response.rspData.userToken);
				ajaxReq(url, reqData, fn);
			} else {
				//跳登录页
				v.$Message.error(response.rspMessage)
				router.push("/");
			}
		}
	}).catch(error => {
		console.log(error);
		v.$Message.error("Token续期失败")
		router.push("/");
	});
}


const ajaxUP=(url,formData,fn,fn_2)=>{
	// console.log(typeof formData)
	formData.append('appId', 'admin-web');
	formData.append('method', 'method');
	formData.append('reqTime', (new Date()).getTime());
	formData.append('sign', 'sign');
	formData.append('signType', 'signType');
	// console.log(formData)
	instance.post(REQ_URL+url,formData,{
		onUploadProgress(progressEvent) {
			fn_2(progressEvent);
  		}
	}).then(response => {

		if(typeof response=='undefined'){
			fn('FAIL','请求失败！');
		}else{
			if(response.rspCode=='03'){
				ajaxToken(url,formData,fn);
			}else if(response.rspCode=='02'){
				v.$Message.error(response.rspMessage)
				router.push("/");
			}else if(response.rspCode=='00'){
				fn('SUCCESS',response.rspMessage,response.rspData)
			}else{
				fn('ERROR',response.rspMessage)
			}
		}
	}).catch(error => {
		console.log(error);
		fn('ERROR','程序错误')
	});
}

const ajaxDown = (url, reqData,fn) => {
	axios.post(REQ_URL + url, {
			appId: "zhyw-web",
			signType: "signType",
			sign: "sign",
			reqTime: new Date().getTime(),
			method: "method",
			reqData: reqData
		}, {
			responseType: "blob",
			headers: {
				"H-User-Token": sessionStorage.getItem("userToken")
			},
			onDownloadProgress(progressEvent) {
				fn(progressEvent);
  			}
		}).then(res => {
			const link = document.createElement("a");
			let blob = new Blob([res.data]);
			link.style.display = "none";
			link.href = URL.createObjectURL(blob);
			link.setAttribute("download", reqData.fileName);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		});
}


export {ajaxReq,ajaxUP,ajaxDown};
