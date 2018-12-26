const App = getApp();

Page({
	data: {
		nowMovie3: [],
		nowMovieStars:[],
		
		soonMovie3: [],
		soonMovieStars:[],
		
		movieTop3: [],
		movieTopStars:[]
	},

	// 封装一个promise,get方法
	get(url) {

		return new Promise((resolve, reject) => {
			let _this = this;
			return wx.request({
				url: url,
				method: 'get',
				header: {
					"content-type": "json"
				},
				data: {
					'count': '3',
					'start': '0',
				},
				success(res) {
					if (res.statusCode == 200) {
						console.log(res);
						resolve(res);
					} else {
						console.log(res.errMsg)
					}
				},
				fail(rej) {
					reject(rej);
					console.log('请求失败')
				}
			});
		});

	},



	onLoad(e) {
		// 调用豆瓣到开放api
		// let get = App.get();
		let nowMovieUrl = App.globalData.nginxUrl + "/in_theaters";
		let soonMovieUrl = App.globalData.nginxUrl + "/coming_soon";
		let MovieTopUrl = App.globalData.nginxUrl + "/top250";

		// 获得三类电影数据

		this.get(nowMovieUrl).then(res=>{
			let nowMovieStars = new Array();
			res.data.subjects.forEach(item=>{
				nowMovieStars.push(parseInt(item.rating.stars.substring(0,1)))
			})
			
			this.setData({
				nowMovie3: res.data.subjects,
				nowMovieStars: nowMovieStars
				// nowMovie3:res.data.subjects
			});
			
			return this.get(soonMovieUrl)
		}).then(res=>{
			let soonMovieStars = new Array();
			res.data.subjects.forEach(item=>{
				soonMovieStars.push(parseInt(item.rating.stars.substring(0,1)))
			})
			this.setData({
				soonMovie3: res.data.subjects,
				soonMovieStars: soonMovieStars
			});
			return this.get(MovieTopUrl)
		}).then(res=>{
			let movieTopStars = new Array();
			res.data.subjects.forEach(item=>{
				movieTopStars.push(parseInt(item.rating.stars.substring(0,1)))
			})
			this.setData({
				movieTop3: res.data.subjects,
				movieTopStars:movieTopStars
			});
		})
		

		// let soonMovieStars = new Array();



		// 设置评分的星星数量
	},


	toMore(e) {
		// 跳转到更多页面
		wx.navigateTo({
			url: './moreMovies/moreMovies'
		})
	},

	toDetail(e) {
		// 跳转到详情页面
		wx.navigateTo({
			url: './moviesDetail/moviesDetail'
		})

	}
})
