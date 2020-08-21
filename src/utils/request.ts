import axios from "axios";
import * as React from "react";
import { notification } from "antd";
import { Const } from "@/utils/const";
import { IRequest } from "@/struct";

export default function req(params: IRequest) {
	return new Promise((resolve, reject) => {
		const instance = axios.create({
			timeout: 15000,
			method: "get"
		});

		instance.interceptors.request.use(
			config => {
				if (!config.params) {
					config.params = {};
				}
				config.params.__timestamp = new Date().getTime();
				return config;
			},
			error => {
				return Promise.reject(error);
			}
		);

		instance.interceptors.response.use(
			response => response,
			error => {
				if (error.request && error.request.timeout) {
					const action = error.config.params.Action || error.config.data.Action;
					return Promise.reject(new Error(`请求超时：${action}`));
				}
				return Promise.reject(error);
			}
		);

		instance(params)
			.then(res => {
				if (res.data.RetCode && res.data.RetCode !== Const.API_SUCCESS_CODE) {
					if (res.data.RetCode === Const.API_VERSION_ERROR_CODE) {
						notification.open({
							key: "updateVersion",
							className: "bg-warning",
							message: React.createElement(
								"div",
								{ className: "text-danger" },
								"版本已更新，请刷新页面噢。",
								React.createElement("a", { className: "text-danger link-like" }, "点击刷新")
							),
							placement: "topRight",
							duration: null,
							onClick: () => {
								window.location.reload();
							}
						});
					} else {
						throw new Error(res.data.Message);
					}
				}
				resolve(res.data);
			})
			.catch(error => {
				reject(error);
			});
	});
}
