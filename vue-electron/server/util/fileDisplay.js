let fs = require('fs');

function fileDisplay(filePath, i18nFilePath) {
	fs.readdir(filePath, (err, files) => {
		// 保存js代码
		let js = '';
		files.forEach(filename => {
			// 需要引入的文件
			js += `import ${filename.split('.')[0]} from './json/${filename}';\n`
		})
		// 需要导出的代码
		js += `
export default {
    zh: {
        ${
            files.map(item => {
                return '...' + item.split('.')[0] + '.zh'
            }).join(',\n\t\t')
            }
    },
    en: {
        ${
            files.map(item => {
                return '...' + item.split('.')[0] + '.en'
            }).join(',\n\t\t')
            }
    }
}
        `;
		// 将js代码保存在当前文件夹的index.js文件中
		fs.writeFile(i18nFilePath + '/index.js', js, err => {
			try {
				if(err) throw new Error(err);
			} catch(err) {
				console.error(err);
			}
		});
	})
}
module.exports = fileDisplay;