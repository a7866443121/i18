function init(app) {
    const filePath = '../i18n/json',
        outFilePath = '../i18n';
    let cors = require('cors'), // 设置跨域请求
        bodyParser = require('body-parser'), // 处理form-data数据
        fs = require('fs'),
        fileDisplay = require('./util/fileDisplay.js');
        cacheConfig = {}, // 缓存字典集
        types = []; // 字典分类名称集

    /** 获取字典集， */    
    setCache();
    
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    /** 查询 */
    app.get('/api', (req, res) => {
        let type = !req.query.type ? types[0] : req.query.type;
        let data = {
            list: getConfigByType(type),
            types: types
        };
        if (data) {
            res.send({
                code: 200,
                msg: '成功',
                data: data
            });
        } else {
            res.send({
                code: 504,
                msg: `未找到${type}的数据`
            });
        }
        
    });
    /** 修改 */
    app.post('/api', (req, res) => {
        let request = req.body;
        cacheConfig[request.type].list = cacheConfig[request.type].list.map(item => {
            if (item.code === request.oldCode && item.code !== request.code) {
                item.code = request.code;
            }
            return item;
        });
        writeFile(request.data, request.type) ? res.send({
            code: 200,
            msg: '修改成功'
        }) : res.send({
            code: 501,
            msg: '修改失败，请重试！'
        });
    });
    /** 新增 */
    app.put('/api', (req, res) => {
        let request = req.body;
        for (let k in cacheConfig) {
            for (let i = 0, len = cacheConfig[k].list.length; i < len; i++) {
                let item = cacheConfig[k].list[i];
                if (item.code === request.code) {
                    res.send({
                        code: 500,
                        msg: `${item.code}在${k}分类中已存在！`
                    });
                    return;
                }
            }
        }
        writeFile(request.data, request.type) ? res.send({
            code: 200,
            msg: '新增成功'
        }) : res.send({
            code: 501,
            msg: '新增失败，请重试！'
        });
        
    });
    /** 删除 */
    app.delete('/api', (req, res) => {
        let request = req.query;
        cacheConfig[request.type].list = cacheConfig[request.type].list.filter(item => {
            return  item.code !== request.code;
        });

        writeFile(void 0, request.type) ? res.send({
            code: 200,
            msg: '删除成功'
        }) : res.send({
            code: 501,
            msg: '删除失败，请重试！'
        });
    });
    /** 新增分类 */
    app.put('/api/addType', (req, res) => {
        let type = req.body.type;
        if (!type || type == 'null'){
            res.send({
                code: 507,
                msg: '新增分类不能为空！'
            });
            return;
        } else if (!/^[a-zA-Z]\w+$/.test(type)) {
            res.send({
                code: 508,
                msg: '分类名称只支持英文、数字、下划线，且必须以英文为首！'
            })
            return;
        } else if (type.length > 15) {
            res.send({
                code: 509,
                msg: '分类名称长度不能超过15个字符！'
            })
            return;
        }
        addType(type) ? res.send({
            code: 200,
            msg: '成功'
        }) : res.send({
            code: 506,
            msg: `${type}分类已存在，不能添加！`
        })
    });
    /** 
     * 写文件
     * @param {object} data - 存储的数据
     * @param {string} fileName - 文件名(分类名)
     */
    function writeFile(data = {}, fileName) {
        data = typeof data === 'string' ? JSON.parse(data) : data;
        let resolve, reject, hasConfig,
            obj = {
                zh: {},
                en: {},
                desc: {}
            };            
        // 将缓存的字典转化为i18n需要使用的类型
        cacheConfig[fileName].list.forEach(item => {            
            if (item.code === data.code) { // 修改已有的字典
                obj.zh[data.code] = data.zh;
                obj.en[data.code] = data.en;
                obj.desc[data.code] = data.desc;
            } else {            
                obj.zh[item.code] = item.zh;
                obj.en[item.code] = item.en;
                obj.desc[item.code] = item.desc;
            }
        });
        // 判断是否已有字典
        hasConfig = cacheConfig[fileName].list.some(item => {
            return item.code === data.code;
        })
        if (!hasConfig && JSON.stringify(data) !== '{}') {
            cacheConfig[fileName].list.push(data);
            obj.zh[data.code] = data.zh;
            obj.en[data.code] = data.en;
            obj.desc[data.code] = data.desc;  
        }
        
        fs.writeFile(`${filePath}/${fileName}.json`, JSON.stringify(obj), err => {
            if (err) reject('文件写入失败！');
            else resolve(true);
        });
        return new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        })
    }

    /** 根据类型获取字典集 */
    function getConfigByType(type) {
        if (cacheConfig.hasOwnProperty(type)) {
            return cacheConfig[type].list;
        } else {
            return [];
        }
    }

    /** 获取所有字典 */
    function getAllConfig() {
        try {
            let files = fs.readdirSync(filePath, 'utf8'),
                config = {};
            files.forEach(fileName => {
                let obj = JSON.parse(fs.readFileSync(`${filePath}/${fileName}`, 'utf8')),
                    typeObj = {};
                typeObj[fileName.split('.')[0]] = { list: [] };
                for (let k in obj['zh']) {
                    typeObj[fileName.split('.')[0]].list.push({
                        code: k,
                        zh: obj['zh'][k],
                        en: obj['en'][k],
                        desc: obj['desc'] && obj['desc'][k],
                    });
                }
                Object.assign(config, typeObj);
            });
            return {
                config,
                types: files.map(item => {
                    return item.split('.')[0];
                }),
            };
        } catch (err) {
            fs.mkdirSync(outFilePath);
            fs.mkdirSync(filePath); 
            return {
                config: {},
                types: [],
            };
        }
        
    }
    /** 设置缓存 */
    function setCache() {
        let getCache = getAllConfig();
        cacheConfig = getCache.config;
        types = getCache.types;
    }
    /** 新增分类 */
    function addType(type) {
        let files = fs.readdirSync(filePath, 'utf8');
        for (let i = 0, len = files.length; i < len; i++) {
            let fileName = files[i];
            if (type === fileName.split('.')[0]) {
                return false;
            }
        }
        fs.writeFileSync(`${filePath}/${type}.json`,JSON.stringify({zh:{},en:{},desc:{}}));
        fileDisplay(filePath, outFilePath);
        setCache();
        return true;
    }
    
}

module.exports = init;