const trainingData = [
	{"id":1,"title":"бицепс гантелей сидя"},
	{"id":2,"title":"бицепс гантелей скотт"},
	{"id":3,"title":"бицепс гантели"},
	{"id":4,"title":"бицепс кривой штангой"},
	{"id":5,"title":"бицепс кроссовер"},
	{"id":6,"title":"бицепс кроссовер нижний блок"},
	{"id":7,"title":"бицепс кроссовер одной рукой нижний"},
	{"id":8,"title":"бицепс кроссовер фронтально верхний блок ко лбу"},
	{"id":9,"title":"бицепс ноги тренажер"},
	{"id":10,"title":"бицепс обратным хватом кроссовер"},
	{"id":11,"title":"бицепс с гантелей молот"},
	{"id":12,"title":"бицепс сидя тренажер фронтально, руки вытянуты вперед"},
	{"id":13,"title":"бицепс скотт"},
	{"id":14,"title":"бицепс широким хватом кроссовер"},
	{"id":15,"title":"бицепс штанга"},
	{"id":16,"title":"внешняя тренажер"},
	{"id":17,"title":"выпады"},
	{"id":18,"title":"выпады боковые"},
	{"id":19,"title":"выпады назад"},
	{"id":20,"title":"гравитрон"},
	{"id":21,"title":"грудь тренажер"},
	{"id":22,"title":"дельта кроссовер"},
	{"id":23,"title":"дельта тренажер"},
	{"id":24,"title":"жим гантелей 45"},
	{"id":25,"title":"жим гантелей лежа"},
	{"id":26,"title":"жим гантелей сидя"},
	{"id":27,"title":"жим лежа 45"},
	{"id":28,"title":"жим лежа 45 2 сек"},
	{"id":29,"title":"жим лежа 45 вниз головой"},
	{"id":30,"title":"жим лежа 45 вниз головой тренажер"},
	{"id":31,"title":"жим лежа 45 тренажер"},
	{"id":32,"title":"жим лежа 45 тренажер 2сек"},
	{"id":33,"title":"жим лежа средним хватом тренажер"},
	{"id":34,"title":"жим лежа средним хватом тренажер 1 подставка"},
	{"id":35,"title":"жим лежа средним хватом тренажер 2 подставка"},
	{"id":36,"title":"жим лежа узким хватом"},
	{"id":37,"title":"жим лежа узким хватом 1 подставка"},
	{"id":38,"title":"жим лежа узким хватом 2 подставка"},
	{"id":39,"title":"жим лежа узким хватом 2 сек"},
	{"id":40,"title":"жим лежа узким хватом тренажер"},
	{"id":41,"title":"жим лежа узким хватом тренажер 1 подставка"},
	{"id":42,"title":"жим лежа узким хватом тренажер 2 сек"},
	{"id":43,"title":"жим лежа широким 1 подставка"},
	{"id":44,"title":"жим лежа широким хватом"},
	{"id":45,"title":"жим лежа широким хватом 2 подставка"},
	{"id":46,"title":"жим лежа широким хватом 2сек"},
	{"id":47,"title":"жим лежа широким хватом тренажер"},
	{"id":48,"title":"жим лежа широким хватом тренажер 1 подставка"},
	{"id":49,"title":"жим лежа широким хватом тренажер 2 сек"},
	{"id":50,"title":"жим ногами тренажер"},
	{"id":51,"title":"жим сидя со стоек"},
	{"id":52,"title":"жим сидя тренажер"},
	{"id":53,"title":"жим стоя со стоек"},
	{"id":54,"title":"икры"},
	{"id":55,"title":"квадрицепс тренажер"},
	{"id":56,"title":"кроссовер разводка в наклоне"},
	{"id":57,"title":"мах назад кроссовер"},
	{"id":58,"title":"наклоны сидя со штангой"},
	{"id":59,"title":"наклоны средним хватом"},
	{"id":60,"title":"наклоны стоя со штангой"},
	{"id":61,"title":"наклоны через козла"},
	{"id":62,"title":"ножницы"},
	{"id":63,"title":"отжимания от брусьев"},
	{"id":64,"title":"отжимания от брусьев тренажер"},
	{"id":65,"title":"перекрестная разводка кроссовер"},
	{"id":66,"title":"подтягивания кроссовер"},
	{"id":67,"title":"подтягивания узким хвтом"},
	{"id":68,"title":"подтягивания узким хвтом тренажер"},
	{"id":69,"title":"подтягивания широким хватом"},
	{"id":70,"title":"подтягивания широким хватом тренажер"},
	{"id":71,"title":"подъем гантелей перед собой"},
	{"id":72,"title":"полубицепс"},
	{"id":73,"title":"предплечье"},
	{"id":74,"title":"пресс"},
	{"id":75,"title":"приводящая тренажер"},
	{"id":76,"title":"пулловер"},
	{"id":77,"title":"разводка 45 кроссовер"},
	{"id":78,"title":"разводка гантелей 45"},
	{"id":79,"title":"разводка гантелей в наклоне"},
	{"id":80,"title":"разводка гантелей в стороны"},
	{"id":81,"title":"разводка гантелей лежа"},
	{"id":82,"title":"разводка лежа кроссовер"},
	{"id":83,"title":"румынская тяга"},
	{"id":84,"title":"сведение ног тренажер"},
	{"id":85,"title":"сед"},
	{"id":86,"title":"сед колодец"},
	{"id":87,"title":"сед скамья"},
	{"id":88,"title":"сед тренажер"},
	{"id":89,"title":"сед узкий"},
	{"id":90,"title":"сед узкий тренажер"},
	{"id":91,"title":"сед фронтальный"},
	{"id":92,"title":"сед широкий тренажер"},
	{"id":93,"title":"сед-стоп"},
	{"id":94,"title":"сумо 2 плинта"},
	{"id":95,"title":"трапеция"},
	{"id":96,"title":"трицепс гантеля"},
	{"id":97,"title":"трицепс кроссовер"},
	{"id":98,"title":"трицепс кроссовер лямка"},
	{"id":99,"title":"трицепс кроссовер одной рукой"},
	{"id":100,"title":"трицепс лямка"},
	{"id":101,"title":"трицепс лямка кроссовер"},
	{"id":102,"title":"трицепс лямка кроссовер верхний блок"},
	{"id":103,"title":"трицепс одной рукой кроссовер"},
	{"id":104,"title":"трицепс тренажер"},
	{"id":105,"title":"тяга к подбородку"},
	{"id":106,"title":"тяга колодец"},
	{"id":107,"title":"тяга обратным хватом"},
	{"id":108,"title":"тяга рывковая"},
	{"id":109,"title":"тяга сумо"},
	{"id":110,"title":"тяга сумо вис"},
	{"id":111,"title":"тяга сумо подставка"},
	{"id":112,"title":"тяга сумо с плинтов"},
	{"id":113,"title":"тяга толчковая"},
	{"id":114,"title":"французкий жим лежа"},
	{"id":115,"title":"французкий жим лежа внутренний хват"},
	{"id":116,"title":"французкий жим лежа кроссовер"},
	{"id":117,"title":"французкий жим сидя"},
	{"id":118,"title":"французкий жим стоя"},
	{"id":119,"title":"хаммер"},
	{"id":120,"title":"швунг"},
	{"id":121,"title":"широчайшая верхний блок кроссовер"},
	{"id":122,"title":"широчайшая гантеля"},
	{"id":123,"title":"широчайшая кроссовер"},
	{"id":124,"title":"широчайшая кроссовер верхний блок"},
	{"id":125,"title":"широчайшая кроссовер одной рукой"},
	{"id":126,"title":"широчайшая лямка кроссовер"},
	{"id":127,"title":"широчайшая тренажер"},
	{"id":128,"title":"широчайшая тренажер внутренний хват"},
	{"id":129,"title":"широчайшая тяга штанги в наклоне"},
	{"id":130,"title":"широчайшая фронтальная тренажер"},
	{"id":131,"title":"широчайшая фронтальная тренажер одной рукой"},
	{"id":132,"title":"широчайшая штанга"}
]


export { trainingData };