var vm = new Vue({
    el: '#app',
    data: {
        ubikeStops: [],
        search:'',
        isSort: false,
        sortType: 0
        //1: sbi正, 2:sbi反, 3:tot正, 4:tot反
    },
  computed:{

        filteredStop() {
          const keyword = this.search; //搜尋的 keyword
          let filteredBike = this.ubikeStops.filter(function (u) {
            return u.sna.includes(keyword);
            }
          )

        // 因 sort 會修改原陣列，所以需要複製一份
        let cloneUbikeStops = [...filteredBike];

        //判斷排序
        if (this.sortType !== 0){
          if (this.sortType === 1){
            return cloneUbikeStops.sort((a, b) => { return b.sbi - a.sbi; });
          } else if (this.sortType === 2){
            return cloneUbikeStops.sort((a, b) => { return a.sbi - b.sbi; });
          } else if (this.sortType === 3) {
            return cloneUbikeStops.sort((a, b) => { return b.tot - a.tot; });
          } else if (this.sortType === 4) {
            return cloneUbikeStops.sort((a, b) => { return a.tot - b.tot; });
          }
        }

      return filteredBike;
      },
    },
    methods:{
      setSortType(sortType){
        this.sortType = sortType;
      }
    },
    filters: {
      timeFormat(t){

        var date = [], time = [];

        date.push(t.substr(0, 4));
        date.push(t.substr(4, 2));
        date.push(t.substr(6, 2));
        time.push(t.substr(8, 2));
        time.push(t.substr(10, 2));
        time.push(t.substr(12, 2));

        return date.join("/") + ' ' + time.join(":");
      }
    },
    created() {

        // 欄位說明請參照:
        // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

        // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
        // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
        // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
        // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態

        axios.get('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz')
            .then(res => {

                // 將 json 轉陣列後存入 this.ubikeStops
                this.ubikeStops = Object.keys(res.data.retVal).map(key => res.data.retVal[key]);

            });

    }
});