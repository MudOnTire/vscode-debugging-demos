// make connection
var socket = io.connect('http://localhost:4000');

// query DOM
var message = document.getElementById('message'),
  user = document.getElementById('user'),
  btn = document.getElementById('send'),
  output = document.getElementById('output'),
  feeback = document.getElementById('feedback');

var names = ['刘杰', '曾涛(Stevie)', '曾燕', '陈建亮', '陈克晗', '陈岚', '陈敏', '陈少强(Shawn C)', '陈思成', '陈思腾', '陈涛', '陈鑫', '陈永前（Kirin）', '陈涌文', '陈长重(Dreamon)', '陈芷薇', '戴辉炳', '戴嵩涛（Tom）', '戴弢', '丁胜', '丁艳', '段奕滨', '杜章亮', '方晨', '方园园', '方瑜嘉', '樊昊', '范亚琪', '范亿清(Van)', '费翔(Rock)', '符萌(fum)', '付思宇(D-Rain)', '甘婷婷', '高翔', '葛良方', '葛娅璇', '管坤(Andy)', '郭莎莎', '何德照', '何清华(heqh)', '何炜', '贺志辉', '侯敏', '华靖江(huajj)', '黄诚天', '黄调聪', '黄东', '黄杰(huangj)', '黄诗尧(Loco)', '黄午言(Same)', '黄小连', '黄蔚晔', '胡建强(will)', '胡军伟', '霍珊珊(sarah)', '胡威', '胡鑫澄', '姜伯(Bole)', '蒋大鹏', '蒋磊', '江立沥', '江婷(Anita)', '姜晓凤', '蒋卓纯', '贾小红（Amity）', '解颖', '京思祺', '金祥林', '季延坤', '雷艳', '李爱珍', '梁细燕', '廖唤忠(liaohz)', '李冰莹', '李高飞', '李广(Landen)', '李海霞(hailie)', '李科宝(Leo)', '李丽艳', '李明发', '凌强(snoopy)', '林祺', '刘安(Andrew)', '刘德志', '刘贵军(Sam)', '刘海洋', '刘浩(james)', '刘红', '刘建军', '刘念', '刘鹏', '刘旺春(liuwangchun)', '刘小杰', '刘雅丽(Sherry)', '刘雨青(Luke)', '刘紫良', '李啸天(Shelton)', '李学峰', '李猷猷（Bruce lee）', '黎毓(Liy)', '楼方君(loufj)', '娄松', '芦成', '卢金凤', '卢兢', '陆亮亮', '罗咏', '罗泽光', '吕志', '马健', '毛月忠', '毛宇峰(maoyf)', 'RMS 负责人 蒙坚', '孟维韬(Jony)', '南京管理员(service)', '牛倩(Amy)', '彭康', '彭强', '钱龙', '秦利达(wadason)', '邱庆', '齐跃伟(（Cherry）)', '饶美英', '饶轶群', '邵天成（stc）', '沈将', '沈杨', '佘雨浩', '施小辉(shixh)', '帅明昊', '宋林林', '孙晨', '孙昊(Hulk)', '孙林(Carr）', '孙佩雯(sunpw)', '涂建民(Jemi)', '屠正松(Gattuso)', '王爱平', '王炳琛', '王建伟(James)', '汪琨(wangk)', '汪敏青', '汪鹏鸿(Big cousin)', '王赛', '王庭浪', '王兴', '汪洋(Allen)', '王逸((Siri))', '王樟毛', '万蒙（wanm）', '万智颖', '吴丰平', '吴扬(phil)', '吴瑶瑶', '武一凡(Evanna)', 'RMS 产品 夏国庆', '向瑶', '谢翔宇', '犀鸟云南京管理员', '犀鸟云南京易宝支付账户', '熊文隽', '徐斌', '薛晨', '薛孟', '薛梦婷', '徐欢(Nicklaus)', '许竞(Kimi)', '徐礼凯(Ryan)', '许允海(Lawrence)', '徐玉姝', '徐赵焱', '杨佳辉', '杨婧博', '杨锴（Mars）', '阳乐(Leo)', '杨亮', '杨黎黎', '杨明涛(Jacky)', '杨宁(Kuma)', 'RMS 前端 杨仁庭', '杨韬', '杨伟民', '杨晓丹(yangxd)', '杨宇(Hunk)', '杨震宇', '颜浩', '姚斌(yaob)', '叶东(川岸殴🐟)', '尹秀峰(尹秀峰)', '游健', '袁征军(（Gerry）)', '余佳佳(Echo)', '于玲玲', '喻培烽', '俞文仙', '于洋洋', '翟浩', '张碧晨', '章剑旸', '张龙(Lion)', '张路路(Broucetrong)', '张琪', '张强(ALEX)', '张强强', '张涛(Dante)', '张文俊', '张孝廉(levi)', '张燕(Zoe)', '张逸蒙', '张益铭', '张莹', '张英菲', '张元武', '占慧敏', '赵芮', '赵统军', '郑聪', '郑慧琴', '郑家玉', '郑维', '钟清莲', '钟章志（Frank）', '周保乐', '周晶晶', '周志明', '祝翠翠', '朱星玥(zhuxy)', '朱志清(zhuzq)', '邹旋平'];

user.value = names[Math.floor(Math.random() * names.length)];

function sendMsg() {
  socket.emit('chat', {
    message: message.value,
    user: user.value
  });
  message.value = "";
}

// emit events 
btn.addEventListener('click', sendMsg);

message.addEventListener('keypress', function (e) {
  if ((e.keyCode || e.which) === 13) {
    sendMsg();
  } else {
    socket.emit('typing', user.value);
  }
});

// listen for events
socket.on('chat', function (data) {
  feeback.innerHTML = '';
  output.innerHTML += `<p><strong>${data.user}: </strong>${data.message}</p>`;
});

socket.on('typing', function (name) {
  feeback.innerHTML = `<p><em>${name} is typing a message...</em></p>`;
});