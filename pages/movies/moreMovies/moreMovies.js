// pages/movies/moreMovies/moreMovies.js
const App = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		allMovies: [],
		start: 0,
		count: 18,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		console.log(options);
		// 显示导航栏加载条
		wx.showNavigationBarLoading();
		let _this = this;
		let url = App.globalData.nginxUrl + '/' + options.type;
		// url放入页面data方便下拉刷新时调用
		this.setData({
			url: url
		});
		let getPromise = new Promise((resolve, reject) => {
			wx.request({
				url: url,
				method: 'get',
				header: {
					"content-type": 'json'
				},
				data: {
					'count': 18,
					'start': 0,
				},
				success(res) {
					if (res.statusCode == 200) {
						resolve(res);
						// 累加count和start数
						_this.setData({
							count: _this.data.count + 18,
							start: _this.data.start + 18
						})
					} else {
						console.log(res.errMsg);
					}
				},
				fail(err) {
					reject(err);
					console.log(err);
				}
			})
		}).then(res => {
			console.log(res);

			// 新属性存放星星数量
			res.data.subjects.forEach(item => {
				item.myStars = parseInt(item.rating.stars.substring(0, 1));
			});
			_this.setData({
				allMovies: res.data.subjects
			});
			// 隐藏加载条
			wx.hideNavigationBarLoading();
			wx.setNavigationBarTitle({
				title: res.data.title
			})
		});


	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {
		console.log('cest');
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		// let count = 18+count;
		wx.showLoading({
			title:'加载中'
		});
		let _this = this;
		let allMovies = this.data.allMovies;
		let getPromise = new Promise((resolve, reject) => {
			wx.request({
				url: this.data.url,
				method: 'get',
				header: {
					"content-type": 'json'
				},
				data: {
					'count': this.data.count,
					'start': this.data.start
				},
				success(res) {
					if (res.statusCode == 200) {
						resolve(res);
						// 累加count和start数
						_this.setData({
							count: _this.data.count + 18,
							start: _this.data.start + 18
						})
					}

				},
				fail(err) {
					reject(err);
					console.log(err);
				}
			})
		}).then(res => {
			console.log(res);
			// 新属性存放星星数量
			res.data.subjects.forEach(item => {
				item.myStars = parseInt(item.rating.stars.substring(0, 1));
			});

			res.data.subjects.forEach(item => {
				allMovies.push(item);
			})
			
			// 数据加载完毕提示
			if(this.data.count >= res.data.total){
				wx.showToast({
					title:'已全部加载完毕',
					icon:'success',
					duration:1000,
				});
			}

			// 手动设置最低载入间隔
			setTimeout(() => {
				wx.hideLoading();
				this.setData({
					allMovies: allMovies
				})
			}, 800);

		});
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
