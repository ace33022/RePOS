/**
 *
 * RePOS
 *
 * @description
 *
 * @version 2018/08/20 初始版本。
 *
 * @author ace
 *
 * @see <a href="http://requirejs.org/">RequireJS</a>
 *
 * @see <a href="https://jquery.com/">jQuery</a>
 *
 * @see <a href="http://underscorejs.org/">Underscore.js</a>
 * @see <a href="https://github.com/jashkenas/underscore">jashkenas/underscore: JavaScript's utility _ belt</a>
 * @see <a href="http://backbonejs.org/">Backbone.js</a>
 * @see <a href="https://github.com/jashkenas/backbone">jashkenas/backbone: Give your JS App some Backbone with Models, Views, Collections, and Events</a>
 * @see <a href="https://github.com/jashkenas/backbone/wiki/Tutorials%2C-blog-posts-and-example-sites">Tutorials, blog posts and example sites · jashkenas/backbone Wiki</a>
 *
 * @see <a href="https://getbootstrap.com/">Bootstrap · The most popular HTML, CSS, and JS library in the world.</a>
 *
 * @comment
 *
 * @todo
 *
 */

Configurations.loadJS(Configurations.requirejsFile, function() {

	requirejs.config(tw.ace33022.RequireJSConfig);
	
	requirejs(["tw.ace33022.vo.Users", "tw.ace33022.util.browser.ReUtils", "tw.ace33022.util.browser.FormUtils"], function(Users, ReUtils, FormUtils) {

		// var localPath = location.href.substring(0, location.href.lastIndexOf("/") + 1);
		var localPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);

		var usersVO = new Users();

		var arrSizesVO = new Array();
		var arrSizeGroupsVO = new Array();
		var arrSizeGroupsDetailVO = new Array();

		var arrSugarsVO = new Array();
		var arrSugarGroupsVO = new Array();
		var arrSugarGroupsDetailVO = new Array();

		var arrIceDosagesVO = new Array();
		var arrIceDosageGroupsVO = new Array();
		var arrIceDosageGroupsDetailVO = new Array();

		var arrDrinksVO = new Array();
		var arrProductsVO = new Array();

		jQuery('.navbar-brand').on('click', function(e) {

			var modalId = 'modal' + Math.random().toString(36).substr(2, 6);

			var tag = '<div class="modal fade" role="dialog" id="' + modalId + '">'
							+ '  <div class="modal-dialog modal-sm" role="document">'
							+ '    <div class="modal-content">'
							+ '      <div class="modal-header">'
							+ '      	 <h4 class="modal-title">主功能</h4>'
							+ '      </div>'
							+ '      <div class="modal-body">'
							+ '        <table class="table table-bordered table-condensed table-hover">'
							+ '          <tbody class="rowlink">'
							+ '            <tr><td style="text-align: center;">登出</td></tr>'
							+ '            <tr><td style="text-align: center;">關於RePOS</td></tr>'
							+ '          </tbody>'
							+ '        </table>'
							+ '      </div>'
							+ '      <div class="modal-footer">'
							+ '        <button type="button" class="btn btn-primary" data-dismiss="modal">關閉</button>'
							+ '      </div>'
							+ '    </div> <!-- /.modal-content -->'
							+ '  </div> <!-- /.modal-dialog -->'
							+ '</div> <!-- /.modal -->'

			var clickIndex = -1;

			e.preventDefault();

			jQuery(tag).appendTo('body');

			jQuery('#' + modalId + ' div > table > tbody > tr:eq(0)').on('click', function(e) {

				clickIndex = 0;

				jQuery('#' + modalId).modal('hide');
			});

			jQuery('#' + modalId + ' div > table > tbody > tr:eq(1)').on('click', function(e) {

				clickIndex = 1;

				jQuery('#' + modalId).modal('hide');
			});

			jQuery('#' + modalId).on('hidden.bs.modal', function() {

				jQuery(this).remove();

				if (clickIndex == 0) {

					FormUtils.showMessage('登出');
				}
				else if (clickIndex == 1) {

					FormUtils.showAbout();
				}
			});

			jQuery('#' + modalId).modal('show');
		});

		function setArrVOToLocalStorage(arrVO, tableName) {

			var voPath = localPath + Configurations.webServiceVOPath + tableName;
			var arrJSON = new Array();

			arrVO.forEach(function(currentValue, index) {arrJSON.push(currentValue.toJSONObject());});

			localStorage.setItem(voPath, JSON.stringify(arrJSON));
		}

		function setArrVOFromLocalStorage(tableName, VO, arrVO) {

			var voPath = localPath + Configurations.webServiceVOPath + tableName;
			var arrJSON;

			if (localStorage.getItem(voPath)) {

				arrJSON = JSON.parse(localStorage.getItem(voPath));
				arrJSON.forEach(function(currentValue, index) {

					var vo = new VO();
					vo.setValueFromJSONObject(currentValue);

					arrVO.push(vo);
				});
			}
		}

		function createSYS00210() {

			jQuery('body').empty();

			requirejs(["tw.ace33022.vo.Sizes", "tw.ace33022.backbone.model.Ancestor", "tw.ace33022.backbone.view.SYS00210", "underscore"], function(Sizes, AncestorModel, View) {
			
				new View({

					"originalModel": AncestorModel.extend({

						"initialize": function() {},
						"defaults": (new Sizes()).toJSONObject(),
						"constructor": function(attributes, options) {Backbone.Model.apply(this, arguments);}
					}),
					"onSelectButtonClick": function(event, callback) {
					
						var self = this;

						FormUtils.selectSizesModal(arrSizesVO, function(sizeCode) {

							var sizes;

							if (sizeCode !== null) {

								sizes = _.find(arrSizesVO, function(vo) {return vo.getSizeCode() == sizeCode;});

								if (typeof sizes !== 'undefined') {

									var model = new self["originalModel"]({});

									model.set(sizes.toJSONObject());

									model.idAttribute = "size_code";

									if (typeof callback === 'function') callback('browse', model);
								}
							}
						});
					},
					"insertMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'sizes';

						var arrSizes = new Array();
						var vo;

						if (typeof _.find(arrSizesVO, function(vo) {return vo.getSizeCode() == model.get('size_code');}) !== 'undefined') {

							FormUtils.showMessage('代碼重複！', function() {

								if (typeof callback === 'function') callback('insert', model);
							});
						}
						else {

							vo = new Sizes();

							vo.setValueFromJSONObject(model.attributes);
							vo.setInsertUserAccount(usersVO.getUserAccount());
							vo.setUpdateUserAccount(usersVO.getUserAccount());

							arrSizesVO.push(vo);

							arrSizesVO.forEach(function(currentValue, index, array) {arrSizes.push(currentValue.toJSONObject());});

							localStorage.setItem(voPath, JSON.stringify(arrSizes));

							if (typeof callback === 'function') callback('browse', model);
						}
					},
					"updateMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'sizes';

						var arrSizes = new Array();
						var vo = _.find(arrSizesVO, function(vo) {return vo.getSizeCode() == model.get('size_code');});

						vo.setValueFromJSONObject(model.attributes);
						vo.setUpdateUserAccount(usersVO.getUserAccount());
						vo.setNowUpdateDateTime();

						arrSizesVO.forEach(function(currentValue, index, array) {arrSizes.push(currentValue.toJSONObject());});

						localStorage.setItem(voPath, JSON.stringify(arrSizes));

						if (typeof callback === 'function') callback('browse', model);
					},
					"onExitButtonClick": function(event) {

						createPOS00020();
					}
				});
			});
		}

		function createSYS00220() {

			jQuery('body').empty();

			requirejs(["tw.ace33022.vo.SizeGroups", "tw.ace33022.vo.SizeGroupsDetail", "tw.ace33022.backbone.model.Ancestor", "tw.ace33022.backbone.view.SYS00220", "underscore"], function(SizeGroups, SizeGroupsDetail, AncestorModel, View) {

				new View({

					"originalModel": AncestorModel.extend({

						"initialize": function() {},
						"defaults": (new SizeGroups()).toJSONObject(),
						"constructor": function(attributes, options) {Backbone.Model.apply(this, arguments);}
					}),
					"onSelectButtonClick": function(event, callback) {

						var self = this;

						FormUtils.selectSizeGroupsModal(arrSizeGroupsVO, function(sizeGroupCode) {

							var vo;
							var model

							if (sizeGroupCode !== null) {

								vo = _.find(arrSizeGroupsVO, function(vo) {return vo.getSizeGroupCode() == sizeGroupCode;});

								if (typeof vo !== 'undefined') {

									model = new self["originalModel"]({});

									model.set(vo.toJSONObject());

									model.idAttribute = "size_group_code";

									if (typeof callback === 'function') callback('browse', model);
								}
							}
						});
					},
					"insertMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'size_groups';

						var arrSizeGroups = new Array();
						var vo;

						if (typeof _.find(arrSizeGroupsVO, function(vo) {return vo.getSizeGroupCode() == model.get('size_group_code');}) !== 'undefined') {

							FormUtils.showMessage('代碼重複！', function() {

								if (typeof callback === 'function') callback('insert', model);
							});
						}
						else {

							vo = new SizeGroups();

							vo.setValueFromJSONObject(model.attributes);
							vo.setInsertUserAccount(usersVO.getUserAccount());
							vo.setUpdateUserAccount(usersVO.getUserAccount());

							arrSizeGroupsVO.push(vo);

							arrSizeGroupsVO.forEach(function(currentValue, index, array) {arrSizeGroups.push(currentValue.toJSONObject());});

							localStorage.setItem(voPath, JSON.stringify(arrSizeGroups));

							if (typeof callback === 'function') callback('browse', model);
						}
					},
					"updateMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'size_groups';

						var arrSizeGroups = new Array();
						var vo = _.find(arrSizeGroupsVO, function(vo) {return vo.getSizeGroupCode() == model.get('size_group_code');});

						vo.setValueFromJSONObject(model.attributes);
						vo.setUpdateUserAccount(usersVO.getUserAccount());
						vo.setNowUpdateDateTime();

						arrSizeGroupsVO.forEach(function(currentValue, index, array) {arrSizeGroups.push(currentValue.toJSONObject());});

						localStorage.setItem(voPath, JSON.stringify(arrSizeGroups));

						if (typeof callback === 'function') callback('browse', model);
					},
					"setDetail": function(model) {

						FormUtils.checkSizeGroupsDetailModal(

							arrSizesVO,
							_.filter(arrSizeGroupsDetailVO, function(vo) {return vo.getSizeGroupCode() == model.get('size_group_code');}),
							function(sizeCode, booDelete, deleteCallback, postCallback) {

								var voPath = localPath + Configurations.webServiceVOPath + 'size_groups_detail';

								var arrSizeGroupsDetail = new Array();

								var vo;

								if (sizeCode !== null) {

									if (booDelete === true) {

										arrSizeGroupsDetailVO = _.filter(arrSizeGroupsDetailVO, function(vo) {return (vo.getSizeGroupCode() != model.get('size_group_code')) || (vo.getSizeCode() != sizeCode);});

										deleteCallback();
									}
									else {

										if (typeof vo === 'undefined') {

											vo = new SizeGroupsDetail();

											vo.setSizeGroupCode(model.get('size_group_code'));
											vo.setSizeCode(sizeCode);
											vo.setInsertUserAccount(usersVO.getUserAccount());
											vo.setUpdateUserAccount(usersVO.getUserAccount());

											vo.initInsertDateTime();

											arrSizeGroupsDetailVO.push(vo);
										}

										postCallback();
									}

									arrSizeGroupsDetailVO.forEach(function(currentValue, index, array) {arrSizeGroupsDetail.push(currentValue.toJSONObject());});

									localStorage.setItem(voPath, JSON.stringify(arrSizeGroupsDetail));
								}
							}
						);
					},
					"onExitButtonClick": function(event) {

						createPOS00020();
					}
				});
			});
		}

		function createSYS00230() {

			jQuery('body').empty();

			requirejs(["tw.ace33022.vo.Sugars", "tw.ace33022.backbone.model.Ancestor", "tw.ace33022.backbone.view.SYS00230", "underscore"], function(Sugars, AncestorModel, View) {

				new View({

					"originalModel": AncestorModel.extend({

						"initialize": function() {},
						"defaults": (new Sugars()).toJSONObject(),
						"constructor": function(attributes, options) {Backbone.Model.apply(this, arguments);}
					}),
					"onSelectButtonClick": function(event, callback) {

						var self = this;

						FormUtils.selectSugarsModal(arrSugarsVO, function(sugarCode) {

							var sugars;

							if (sugarCode !== null) {

								sugars = _.find(arrSugarsVO, function(vo) {return vo.getSugarCode() == sugarCode;});

								if (typeof sugars !== 'undefined') {

									var model = new self["originalModel"]({});

									model.set(sugars.toJSONObject());

									model.idAttribute = "sugar_code";

									if (typeof callback === 'function') callback('browse', model);
								}
							}
						});
					},
					"insertMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'sugars';

						var arrSugars = new Array();
						var vo;

						if (typeof _.find(arrSugarsVO, function(vo) {return vo.getSugarCode() == model.get('sugar_code');}) !== 'undefined') {

							FormUtils.showMessage('代碼重複！', function() {

								if (typeof callback === 'function') callback('insert', model);
							});
						}
						else {

							vo = new Sugars();

							vo.setValueFromJSONObject(model.attributes);
							vo.setInsertUserAccount(usersVO.getUserAccount());
							vo.setUpdateUserAccount(usersVO.getUserAccount());

							arrSugarsVO.push(vo);

							arrSugarsVO.forEach(function(currentValue, index, array) {arrSugars.push(currentValue.toJSONObject());});

							localStorage.setItem(voPath, JSON.stringify(arrSugars));

							if (typeof callback === 'function') callback('browse', model);
						}
					},
					"updateMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'sugars';

						var arrSugars = new Array();
						var vo = _.find(arrSugarsVO, function(vo) {return vo.getSugarCode() == model.get('sugar_code');});

						vo.setValueFromJSONObject(model.attributes);
						vo.setUpdateUserAccount(usersVO.getUserAccount());
						vo.setNowUpdateDateTime();

						arrSugarsVO.forEach(function(currentValue, index, array) {arrSugars.push(currentValue.toJSONObject());});

						localStorage.setItem(voPath, JSON.stringify(arrSugars));

						if (typeof callback === 'function') callback('browse', model);
					},
					"onExitButtonClick": function(event) {

						createPOS00020();
					}
				});
			});
		}

		function createSYS00240() {

			jQuery('body').empty();

			requirejs(["tw.ace33022.vo.SugarGroups", "tw.ace33022.vo.SugarGroupsDetail", "tw.ace33022.backbone.model.Ancestor", "tw.ace33022.backbone.view.SYS00240", "underscore"], function(SugarGroups, SugarGroupsDetail, AncestorModel, View) {

				new View({

					"originalModel": AncestorModel.extend({

						"initialize": function() {},
						"defaults": (new SugarGroups()).toJSONObject(),
						"constructor": function(attributes, options) {Backbone.Model.apply(this, arguments);}
					}),
					"onSelectButtonClick": function(event, callback) {

						var self = this;

						FormUtils.selectSugarGroupsModal(arrSugarGroupsVO, function(sugarGroupCode) {

							var vo;
							var model

							if (sugarGroupCode !== null) {

								vo = _.find(arrSugarGroupsVO, function(vo) {return vo.getSugarGroupCode() == sugarGroupCode;});

								if (typeof vo !== 'undefined') {

									model = new self["originalModel"]({});

									model.set(vo.toJSONObject());

									model.idAttribute = "sugar_group_code";

									if (typeof callback === 'function') callback('browse', model);
								}
							}
						});
					},
					"insertMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'sugar_groups';

						var arrSugarGroups = new Array();
						var vo;

						if (typeof _.find(arrSugarGroupsVO, function(vo) {return vo.getSugarGroupCode() == model.get('sugar_group_code');}) !== 'undefined') {

							FormUtils.showMessage('代碼重複！', function() {

								if (typeof callback === 'function') callback('insert', model);
							});
						}
						else {

							vo = new SugarGroups();

							vo.setValueFromJSONObject(model.attributes);
							vo.setInsertUserAccount(usersVO.getUserAccount());
							vo.setUpdateUserAccount(usersVO.getUserAccount());

							arrSugarGroupsVO.push(vo);

							arrSugarGroupsVO.forEach(function(currentValue, index, array) {arrSugarGroups.push(currentValue.toJSONObject());});

							localStorage.setItem(voPath, JSON.stringify(arrSugarGroups));

							if (typeof callback === 'function') callback('browse', model);
						}
					},
					"updateMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'sugar_groups';

						var arrSugarGroups = new Array();
						var vo = _.find(arrSugarGroupsVO, function(vo) {return vo.getSugarGroupCode() == model.get('sugar_group_code');});

						vo.setValueFromJSONObject(model.attributes);
						vo.setUpdateUserAccount(usersVO.getUserAccount());
						vo.setNowUpdateDateTime();

						arrSugarGroupsVO.forEach(function(currentValue, index, array) {arrSugarGroups.push(currentValue.toJSONObject());});

						localStorage.setItem(voPath, JSON.stringify(arrSugarGroups));

						if (typeof callback === 'function') callback('browse', model);
					},
					"setDetail": function(model) {

						FormUtils.checkSugarGroupsDetailModal(

							arrSugarsVO,
							_.filter(arrSugarGroupsDetailVO, function(vo) {return vo.getSugarGroupCode() == model.get('sugar_group_code');}),
							function(sugarCode, booDelete, deleteCallback, postCallback) {

								var voPath = localPath + Configurations.webServiceVOPath + 'sugar_groups_detail';

								var arrSugarGroupsDetail = new Array();

								var vo;

								if (sugarCode !== null) {

									if (booDelete === true) {

										arrSugarGroupsDetailVO = _.filter(arrSugarGroupsDetailVO, function(vo) {return (vo.getSugarGroupCode() != model.get('sugar_group_code')) || (vo.getSugarCode() != sugarCode);});

										deleteCallback();
									}
									else {

										if (typeof vo === 'undefined') {

											vo = new SugarGroupsDetail();

											vo.setSugarGroupCode(model.get('sugar_group_code'));
											vo.setSugarCode(sugarCode);
											vo.setInsertUserAccount(usersVO.getUserAccount());
											vo.setUpdateUserAccount(usersVO.getUserAccount());

											vo.initInsertDateTime();

											arrSugarGroupsDetailVO.push(vo);
										}

										postCallback();
									}

									arrSugarGroupsDetailVO.forEach(function(currentValue, index, array) {arrSugarGroupsDetail.push(currentValue.toJSONObject());});

									localStorage.setItem(voPath, JSON.stringify(arrSugarGroupsDetail));
								}
							}
						);
					},
					"onExitButtonClick": function(event) {

						createPOS00020();
					}
				});
			});
		}

		function createSYS00250() {

			jQuery('body').empty();

			requirejs(["tw.ace33022.vo.IceDosages", "tw.ace33022.backbone.model.Ancestor", "tw.ace33022.backbone.view.SYS00250", "underscore"], function(IceDosages, AncestorModel, View) {

				new View({

					"originalModel": AncestorModel.extend({

						"initialize": function() {},
						"defaults": (new IceDosages()).toJSONObject(),
						"constructor": function(attributes, options) {Backbone.Model.apply(this, arguments);}
					}),
					"onSelectButtonClick": function(event, callback) {

						var self = this;

						FormUtils.selectIceDosagesModal(arrIceDosagesVO, function(iceDosageCode) {

							var iceDosages;
							var model

							if (iceDosageCode !== null) {

								iceDosages = _.find(arrIceDosagesVO, function(vo) {return vo.getIceDosageCode() == iceDosageCode;});

								if (typeof iceDosages !== 'undefined') {

									model = new self["originalModel"]({});

									model.set(iceDosages.toJSONObject());

									model.idAttribute = "iceDosage_code";

									if (typeof callback === 'function') callback('browse', model);
								}
							}
						});
					},
					"insertMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'ice_dosages';

						var vo;
						var arrIceDosages = new Array();

						if (typeof _.find(arrIceDosagesVO, function(vo) {return vo.getIceDosageCode() == model.get('ice_dosage_code');}) !== 'undefined') {

							FormUtils.showMessage('代碼重複！', function() {

								if (typeof callback === 'function') callback('insert', model);
							});
						}
						else {

							vo = new IceDosages();

							vo.setValueFromJSONObject(model.attributes);
							vo.setInsertUserAccount(usersVO.getUserAccount());
							vo.setUpdateUserAccount(usersVO.getUserAccount());

							arrIceDosagesVO.push(vo);

							arrIceDosagesVO.forEach(function(currentValue, index, array) {arrIceDosages.push(currentValue.toJSONObject());});

							localStorage.setItem(voPath, JSON.stringify(arrIceDosages));

							if (typeof callback === 'function') callback('browse', model);
						}
					},
					"updateMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'ice_dosages';

						var arrIceDosages = new Array();
						var vo = _.find(arrIceDosagesVO, function(vo) {return vo.getIceDosageCode() == model.get('ice_dosage_code');});

						vo.setValueFromJSONObject(model.attributes);
						vo.setUpdateUserAccount(usersVO.getUserAccount());
						vo.setNowUpdateDateTime();

						arrIceDosagesVO.forEach(function(currentValue, index, array) {arrIceDosages.push(currentValue.toJSONObject());});

						localStorage.setItem(voPath, JSON.stringify(arrIceDosages));

						if (typeof callback === 'function') callback('browse', model);
					},
					"onExitButtonClick": function(event) {

						createPOS00020();
					}
				});
			});
		}

		function createSYS00260() {

			jQuery('body').empty();

			requirejs(["tw.ace33022.vo.IceDosageGroups", "tw.ace33022.vo.IceDosageGroupsDetail", "tw.ace33022.backbone.model.Ancestor", "tw.ace33022.backbone.view.SYS00260", "underscore"], function(IceDosageGroups, IceDosageGroupsDetail, AncestorModel, View) {

				new View({

					"originalModel": AncestorModel.extend({

						"initialize": function() {},
						"defaults": (new IceDosageGroups()).toJSONObject(),
						"constructor": function(attributes, options) {Backbone.Model.apply(this, arguments);}
					}),
					"onSelectButtonClick": function(event, callback) {

						var self = this;

						FormUtils.selectIceDosageGroupsModal(arrIceDosageGroupsVO, function(iceDosageGroupCode) {

							var vo;
							var model

							if (iceDosageGroupCode !== null) {

								vo = _.find(arrIceDosageGroupsVO, function(vo) {return vo.getIceDosageGroupCode() == iceDosageGroupCode;});

								if (typeof vo !== 'undefined') {

									model = new self["originalModel"]({});

									model.set(vo.toJSONObject());

									model.idAttribute = "ice_dosage_group_code";

									if (typeof callback === 'function') callback('browse', model);
								}
							}
						});
					},
					"insertMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'ice_dosage_groups';

						var arrIceDosageGroups = new Array();
						var vo;

						if (typeof _.find(arrIceDosageGroupsVO, function(vo) {return vo.getIceDosageGroupCode() == model.get('ice_dosage_group_code');}) !== 'undefined') {

							FormUtils.showMessage('代碼重複！', function() {

								if (typeof callback === 'function') callback('insert', model);
							});
						}
						else {

							vo = new IceDosageGroups();

							vo.setValueFromJSONObject(model.attributes);
							vo.setInsertUserAccount(usersVO.getUserAccount());
							vo.setUpdateUserAccount(usersVO.getUserAccount());

							arrIceDosageGroupsVO.push(vo);

							arrIceDosageGroupsVO.forEach(function(currentValue, index, array) {arrIceDosageGroups.push(currentValue.toJSONObject());});

							localStorage.setItem(voPath, JSON.stringify(arrIceDosageGroups));

							if (typeof callback === 'function') callback('browse', model);
						}
					},
					"updateMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'ice_dosage_groups';

						var arrIceDosageGroups = new Array();
						var vo = _.find(arrIceDosageGroupsVO, function(vo) {return vo.getIceDosageGroupCode() == model.get('ice_dosage_group_code');});

						vo.setValueFromJSONObject(model.attributes);
						vo.setUpdateUserAccount(usersVO.getUserAccount());
						vo.setNowUpdateDateTime();

						arrIceDosageGroupsVO.forEach(function(currentValue, index, array) {arrIceDosageGroups.push(currentValue.toJSONObject());});

						localStorage.setItem(voPath, JSON.stringify(arrIceDosageGroups));

						if (typeof callback === 'function') callback('browse', model);
					},
					"setDetail": function(model) {

						FormUtils.checkIceDosageGroupsDetailModal(

							arrIceDosagesVO,
							_.filter(arrIceDosageGroupsDetailVO, function(vo) {return vo.getIceDosageGroupCode() == model.get('ice_dosage_group_code');}),
							function(iceDosageCode, booDelete, deleteCallback, postCallback) {

								var voPath = localPath + Configurations.webServiceVOPath + 'ice_dosage_groups_detail';

								var arrIceDosageGroupsDetail = new Array();

								var vo;

								if (iceDosageCode !== null) {

									if (booDelete === true) {

										arrIceDosageGroupsDetailVO = _.filter(arrIceDosageGroupsDetailVO, function(vo) {return (vo.getIceDosageGroupCode() != model.get('ice_dosage_group_code')) || (vo.getIceDosageCode() != iceDosageCode);});

										deleteCallback();
									}
									else {

										if (typeof vo === 'undefined') {

											vo = new IceDosageGroupsDetail();

											vo.setIceDosageGroupCode(model.get('ice_dosage_group_code'));
											vo.setIceDosageCode(iceDosageCode);
											vo.setInsertUserAccount(usersVO.getUserAccount());
											vo.setUpdateUserAccount(usersVO.getUserAccount());

											vo.initInsertDateTime();

											arrIceDosageGroupsDetailVO.push(vo);
										}

										postCallback();
									}

									arrIceDosageGroupsDetailVO.forEach(function(currentValue, index, array) {arrIceDosageGroupsDetail.push(currentValue.toJSONObject());});

									localStorage.setItem(voPath, JSON.stringify(arrIceDosageGroupsDetail));
								}
							}
						);
					},
					"onExitButtonClick": function(event) {

						createPOS00020();
					}
				});
			});
		}

		function createSYS00270() {

			jQuery('body').empty();

			requirejs(["tw.ace33022.vo.Drinks", "tw.ace33022.backbone.model.Ancestor", "tw.ace33022.backbone.view.SYS00270", "underscore"], function(Drinks, AncestorModel, View) {

				new View({

					"originalModel": AncestorModel.extend({

						"initialize": function() {},
						"defaults": (new Drinks()).toJSONObject(),
						"constructor": function(attributes, options) {Backbone.Model.apply(this, arguments);}
					}),
					"getArrSizeGroupsVO": function() {

						return arrSizeGroupsVO;
					},
					"getArrSugarGroupsVO": function() {

						return arrSugarGroupsVO;
					},
					"getArrIceDosageGroupsVO": function() {

						return arrIceDosageGroupsVO;
					},
					"getArrDrinksVO": function() {

						return arrDrinksVO;
					},
					"onSelectButtonClick": function(event, callback) {

						var self = this;

						FormUtils.selectDrinksModal(self.getArrDrinksVO(), function(drinkCode) {

							var drinks;
							var model

							if (drinkCode != null) {

								drinks = _.find(self.getArrDrinksVO(), function(vo) {return vo.getDrinkCode() == drinkCode;});

								if (typeof drinks !== 'undefined') {

									model = new self["originalModel"]({});

									model.set(drinks.toJSONObject());

									model.idAttribute = "drink_code";

									if (typeof callback === 'function') callback('browse', model);
								}
							}
						});
					},
					"insertMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'drinks';

						var vo;
						var arrDrinks = new Array();

						model.set('drink_img_base64', self.$el.find('[data-field-name="drink_img_base64"]').attr('src'));

						if (typeof _.find(self.getArrDrinksVO(), function(vo) {return vo.getDrinkCode() == model.get('drink_code');}) !== 'undefined') {

							FormUtils.showMessage('代碼重複！', function() {

								if (typeof callback === 'function') callback('insert', model);
							});
						}
						else {

							vo = new Drinks();

							vo.setValueFromJSONObject(model.attributes);
							vo.setInsertUserAccount(usersVO.getUserAccount());
							vo.setUpdateUserAccount(usersVO.getUserAccount());

							self.getArrDrinksVO().push(vo);

							self.getArrDrinksVO().forEach(function(currentValue, index, array) {arrDrinks.push(currentValue.toJSONObject());});

							localStorage.setItem(voPath, JSON.stringify(arrDrinks));

							if (typeof callback === 'function') callback('browse', model);
						}
					},
					"updateMethod": function(model, callback) {

						var self = this;

						var voPath = localPath + Configurations.webServiceVOPath + 'drinks';

						var arrDrinks = new Array();
						var vo = _.find(self.getArrDrinksVO(), function(vo) {return vo.getDrinkCode() == model.get('drink_code');});

						model.set('drink_img_base64', self.$el.find('[data-field-name="drink_img_base64"]').attr('src'));

						vo.setValueFromJSONObject(model.attributes);
						vo.setNowUpdateDateTime();
						vo.setUpdateUserAccount(usersVO.getUserAccount());

						self.getArrDrinksVO().forEach(function(currentValue, index, array) {arrDrinks.push(currentValue.toJSONObject());});

						localStorage.setItem(voPath, JSON.stringify(arrDrinks));

						if (typeof callback === 'function') callback('browse', model);
					},
					"deleteMethod": function(model, callback) {

						FormUtils.showConfirmMessage(

							'確認停用本筆飲料資料？',
							function() {

								var arrDrinks = new Array();
								var vo = _.find(arrDrinksVO, function(vo) {return vo.getDrinkCode() == model.get('drink_code');});

								model.set('invalid_flag', '1');

								vo.setValueFromJSONObject(model.attributes);
								vo.setNowUpdateDateTime();
								vo.setUpdateUserAccount(usersVO.getUserAccount());

								arrDrinksVO.push(vo);

								arrDrinksVO.forEach(function(currentValue, index, array) {arrDrinks.push(currentValue.toJSONObject());});

								localStorage.setItem(localPath + Configurations.webServiceVOPath + 'drinks', JSON.stringify(arrDrinks));

								if (typeof callback === 'function') callback('init', model);
							},
							function() {

								if (typeof callback == 'function') callback('browse', model);
							}
						);
					},
					"onExitButtonClick": function(event) {

						createPOS00020();
					},
					"expandToProducts": function(event, model, callback) {

						var self = this;

						FormUtils.showMarqueebar(

							'轉出商品資料‧‧‧',
							function(closeMarqueebar) {

								var arrProducts = new Array();
								var arrDrinks = new Array();

								var vo = _.find(self.getArrDrinksVO(), function(vo) {return vo.getDrinkCode() === model.get('drink_code');});

								arrProductsVO = arrProductsVO.concat(

									vo.tranToProductsVO(

										usersVO.getUserAccount(),
										'0',
										function(self) {return _.filter(arrSizeGroupsDetailVO, function(vo) {return ((vo.getSizeGroupCode() == self.getSizeGroupCode()) && (vo.getInvalidFlag() == '0'));});},
										function(self) {return _.filter(arrSugarGroupsDetailVO, function(vo) {return ((vo.getSugarGroupCode() == self.getSugarGroupCode()) && (vo.getInvalidFlag() == '0'));});},
										function(self) {return _.filter(arrIceDosageGroupsDetailVO, function(vo) {return ((vo.getIceDosageGroupCode() == self.getIceDosageGroupCode()) && (vo.getInvalidFlag() == '0'));});},
										function(self) {return _.filter(arrSizesVO, function(vo) {return vo.getInvalidFlag() == '0';});},
										function(self) {return _.filter(arrSugarsVO, function(vo) {return vo.getInvalidFlag() == '0';});},
										function(self) {return _.filter(arrIceDosagesVO, function(vo) {return vo.getInvalidFlag() == '0';});}
									)
								);

								model.set('expand_product_flag', '1');

								vo.setExpandProductFlag('1');
								vo.setUpdateUserAccount(usersVO.getUserAccount());
								vo.setNowUpdateDateTime();

								arrProductsVO.forEach(function(currentValue, index, array) {arrProducts.push(currentValue.toJSONObject());});

								localStorage.setItem(localPath + Configurations.webServiceVOPath + 'products', JSON.stringify(arrProducts));

								arrDrinksVO.forEach(function(currentValue, index, array) {arrDrinks.push(currentValue.toJSONObject());});

								localStorage.setItem(localPath + Configurations.webServiceVOPath + 'drinks', JSON.stringify(arrDrinks));

								closeMarqueebar();
							},
							function() {

								FormUtils.showMessage('轉出商品資料完成！', function() {

									if (typeof callback === 'function') callback('browse', model);
								});
							}
						);
					}
				});
			});
		}

		function createPOS00020() {

			jQuery('body').empty();

			requirejs(["tw.ace33022.vo.POSTrnLogs", "tw.ace33022.backbone.view.POS00020", "moment", "x-editable-bootstrap3"], function(POSTrnLogs, View, moment) {
			
				function checkTranDetail(noneZeroFunction, zeroFunction) {

					if (view.getArrPOSTrnLogsDetailVO().length !== 0) {

						if (typeof noneZeroFunction === 'function') noneZeroFunction();
					}
					else {

						FormUtils.showMessage('沒有明細資料！',

							function() {if (typeof zeroFunction === 'function') zeroFunction();}
						);
					}
				}

				function confirmAbortTran(callback) {

					if (view.getArrPOSTrnLogsDetailVO().length !== 0) {

						FormUtils.showConfirmMessage(

							'是否放棄目前交易？',
							function() {

								view.newTran();

								if (typeof callback === 'function') callback();
							}
						);
					}
					else {

						if (typeof callback === 'function') callback();
					}
				}

				var view = new View({

					"getUsersVO": function() {

						return usersVO;
					},
					"getPOSTrnLogsVO": function() {

						var self = this;

						var posTrnLogsVO = new POSTrnLogs();

						posTrnLogsVO.setTrnDate(moment(new Date()).format(Configurations.DateFormatString));
						posTrnLogsVO.setStoreCode('00001');
						posTrnLogsVO.setPOSNo('001');
						posTrnLogsVO.setUserAccount(self.getUsersVO().getUserAccount());
						posTrnLogsVO.setUserName(self.getUsersVO().getUserName());
						posTrnLogsVO.setInsertUserAccount(self.getUsersVO().getUserAccount());
						posTrnLogsVO.setUpdateUserAccount(self.getUsersVO().getUserAccount());

						return posTrnLogsVO;
					},
					"getArrProductsVO": function() {

						return arrProductsVO;
					},
					"getArrDrinksVO": function() {

						return arrDrinksVO;
					},
					"getArrSizesVO": function() {

						return arrSizesVO;
					},
					"getArrSizeGroupsDetailVO": function() {

						return arrSizeGroupsDetailVO;
					},
					"getArrSugarsVO": function() {

						return arrSugarsVO;
					},
					"getArrSugarGroupsDetailVO": function() {

						return arrSugarGroupsDetailVO;
					},
					"getArrIceDosagesVO": function() {

						return arrIceDosagesVO;
					},
					"getArrIceDosageGroupsDetailVO": function() {

						return arrIceDosageGroupsDetailVO;
					},
					"saveTran": function() {

						var self = this;

						var arrPOSTrnLogs = new Array();
						var arrPOSTrnLogsDetail = new Array();

						var trnPath;

						trnPath = localPath + Configurations.webServiceVOPath + 'pos_trn_logs' + '/' + self.getPOSTrnLogsVO().getTrnDate();
						if (localStorage.getItem(trnPath)) arrPOSTrnLogs = JSON.parse(localStorage.getItem(trnPath));

						self.getPOSTrnLogsVO().setTrnNo(sprintf('%05d', arrPOSTrnLogs.length + 1));

						arrPOSTrnLogs.push(self.getPOSTrnLogsVO().toJSONObject());

						localStorage.setItem(trnPath, JSON.stringify(arrPOSTrnLogs));

						trnPath = localPath + Configurations.webServiceVOPath + 'pos_trn_logs_detail' + '/' + self.getPOSTrnLogsVO().getTrnDate();
						if (localStorage.getItem(trnPath)) arrPOSTrnLogsDetail = JSON.parse(localStorage.getItem(trnPath));

						self.getArrPOSTrnLogsDetailVO().forEach(function(currentValue, index, array) {

							currentValue.setTrnNo(self.getPOSTrnLogsVO().getTrnNo());

							arrPOSTrnLogsDetail.push(currentValue.toJSONObject());
						});

						localStorage.setItem(trnPath, JSON.stringify(arrPOSTrnLogsDetail));

						self.newTran();

						return self;
					}
				});
				
				view.addDropdownMenu({

					"menuCaption": "交易處理",
					"items": [
						{
							"caption": "結帳",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								checkTranDetail(

									function() {

										var objModal = view.showTranModal('1');
										var btnConfirm = 'btnConfirm' + Math.random().toString(36).substr(2, 6);

										objModal.find('.modal-footer').append('<button type="button" id="' + btnConfirm + '" class="btn btn-primary">確認</button>');
										objModal.find('.modal-footer').append('<button type="button" class="btn" data-dismiss="modal">取消</button>');

										jQuery('#' + btnConfirm).on('click', function(event) {

											objModal.modal('hide');

											view.saveTran();
										});
									}
								);
							}
						},
						{
							"caption": "交易明細查詢",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								checkTranDetail(

									function() {

										var objModal = view.showTranModal('0');

										// 增加結帳？
										objModal.find('.modal-footer').append('<button type="button" class="btn btn-primary" data-dismiss="modal">離開</button>');
									}
								);
							}
						},
						{
							"caption": "取消此筆明細",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								view.newRecord();
							}
						},
						{
							"caption": "開啟新交易",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								if (view.getArrPOSTrnLogsDetailVO().length !== 0) {

									FormUtils.showConfirmMessage(

										'是否放棄目前的交易？',
										view.newTran()
									);
								}
								else {

									view.newTran();
								}
							}
						}
					]
				});

				view.addDropdownMenu({

					"menuCaption": "報表",
					"items": [
						{
							"caption": "交易明細",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(

									function() {

										FormUtils.showBetweenTrnDateModal(function(beginDate, endDate) {

											requirejs(["tw.ace33022.vo.POSTrnLogsDetail"], function(POSTrnLogsDetail) {

												var rowId = 'rowId' + Math.random().toString(36).substr(2, 6);

												var objRow;

												var tag;
												var trnDate;
												var trnPath;
												var vo;
												var qty = 0, total = 0;

												var arrPOSTrnLogsDetail = new Array();

												if ((typeof beginDate !== 'undefined') && (typeof endDate !== 'undefined')) {

													for (trnDate = beginDate; trnDate <= endDate; trnDate.add(1, 'day')) {

														trnPath = localPath + Configurations.webServiceVOPath + 'pos_trn_logs_detail' + '/' + trnDate.format(Configurations.SaveDateFormatString);

														if (localStorage.getItem(trnPath)) arrPOSTrnLogsDetail = arrPOSTrnLogsDetail.concat(JSON.parse(localStorage.getItem(trnPath)));
													}

													if (arrPOSTrnLogsDetail.length !== 0) {

														tag = '<div id="' + rowId + '" class="row">'
																+ '  <table class="table table-hover table-striped">'
																+ '    <thead>'
																+ '      <tr style="display: inline-table; table-layout: fixed; width: 99%;">'
																+ '        <th style="text-align: center;">交易日期</th>'
																+ '        <th style="text-align: center;">名稱</th>'
																+ '        <th style="text-align: center;">價格</th>'
																+ '        <th style="text-align: center;">數量</th>'
																+ '        <th style="text-align: center;">小計</th>'
																+ '      </tr>'
																+ '    </thead>'
																+ '    <tbody style="position: absolute; overflow-y: scroll; height: 80%;"></tbody>'
																+ '  </table>'
																+ '</div>';
														objRow = jQuery(tag);

														vo = new POSTrnLogsDetail();

														for (index = 0; index < arrPOSTrnLogsDetail.length; index++) {

															vo.setValueFromJSONObject(arrPOSTrnLogsDetail[index]);

															qty += vo.getTrnQty();
															total += vo.getTrnTotal();

															tag = '<tr style="display: inline-table; table-layout: fixed; width: 99%;">'
																	+ '  <td style="text-align: center; vertical-align: middle;">' + moment(vo.getTrnDate(), Configurations.SaveDateFormatString, true).format(Configurations.ShowDateFormatString) + '</td>'
																	+ '  <td style="text-align: left; vertical-align: middle;">' + vo.getProductName() + '</td>'
																	+ '  <td style="text-align: right; vertical-align: middle;">' + vo.getProductPrice() + '</td>'
																	+ '  <td style="text-align: right; vertical-align: middle;">' + vo.getTrnQty() + '</td>'
																	+ '  <td style="text-align: right; vertical-align: middle;">' + vo.getTrnTotal() + '</td>'
																	+ '</tr>';
															objRow.find('tbody').append(tag);
														}

														tag = '<tr style="display: inline-table; table-layout: fixed; width: 99%;">'
																+ '  <td></td>'
																+ '  <td style="text-align: left; vertical-align: middle;">總計</td>'
																+ '  <td style="text-align: right; vertical-align: middle;"></td>'
																+ '  <td style="text-align: right; vertical-align: middle;">' + (new String(qty)) + '</td>'
																+ '  <td style="text-align: right; vertical-align: middle;">' + (new String(total)) + '</td>'
																+ '</tr>';
														objRow.find('tbody').append(tag);

														view.clearContainer();
														view.appendRow(objRow);
													}
													else {

														FormUtils.showMessage('查無資料！');
													}
												}
											});
										});
									}
								);
							}
						},
						{
							"caption": "交易金額",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(

									function() {

										FormUtils.showBetweenTrnDateModal(function(beginDate, endDate) {

											requirejs(["tw.ace33022.vo.POSTrnLogsDetail"], function(POSTrnLogsDetail) {

												var rowId = 'rowId' + Math.random().toString(36).substr(2, 6);

												var objRow;

												var trnDate;
												var trnPath;
												var index;
												var vo = new POSTrnLogsDetail();
												var qty = 0, total = 0;
												var tqty = 0, ttotal = 0;

												var arrPOSTrnLogsDetail = new Array();
												var arrData = new Array();

												var tag = '<div id="' + rowId + '" class="row">'
																+ '  <table class="table table-hover table-striped">'
																+ '    <thead>'
																+ '      <tr style="display: inline-table; table-layout: fixed; width: 99%;">'
																+ '        <th style="text-align: center;">交易日期</th>'
																+ '        <th style="text-align: center;">數量</th>'
																+ '        <th style="text-align: center;">小計</th>'
																+ '      </tr>'
																+ '    </thead>'
																+ '    <tbody style="position: absolute; overflow-y: scroll; height: 80%;"></tbody>'
																+ '  </table>'
																+ '</div>';
												objRow = jQuery(tag);

												if ((typeof beginDate != 'undefined') && (typeof endDate != 'undefined')) {

													for (trnDate = beginDate; trnDate <= endDate; trnDate.add(1, 'day')) {

														qty = 0;
														total = 0;
														arrPOSTrnLogsDetail.length = 0;

														trnPath = localPath + Configurations.webServiceVOPath + 'pos_trn_logs_detail' + '/' + trnDate.format(Configurations.SaveDateFormatString);

														if (localStorage.getItem(trnPath)) arrPOSTrnLogsDetail = arrPOSTrnLogsDetail.concat(JSON.parse(localStorage.getItem(trnPath)));

														arrPOSTrnLogsDetail.forEach(function(currentValue, index, array) {

															vo.setValueFromJSONObject(currentValue);

															qty += vo.getTrnQty();
															total += vo.getTrnTotal();
														});

														tqty += qty;
														ttotal += total;

														if (qty != 0) {

															arrData.push({

																"trn_date": trnDate.format(Configurations.ShowDateFormatString),
																"qty": qty,
																"total": total
															});
														}
													}

													if (arrData.length != 0) {

														for (index = 0; index < arrData.length; index++) {

															tag = '<tr style="display: inline-table; table-layout: fixed; width: 99%;">'
																	+ '  <td style="text-align: center; vertical-align: middle;">' + arrData[index]["trn_date"] + '</td>'
																	+ '  <td style="text-align: right; vertical-align: middle;">' + arrData[index]["qty"] + '</td>'
																	+ '  <td style="text-align: right; vertical-align: middle;">' + arrData[index]["total"] + '</td>'
																	+ '</tr>';
															objRow.find('tbody').append(tag);
														}

														tag = '<tr style="display: inline-table; table-layout: fixed; width: 99%;">'
																+ '  <td style="text-align: center; vertical-align: middle;">總計</td>'
																+ '  <td style="text-align: right; vertical-align: middle;">' + (new String(tqty)) + '</td>'
																+ '  <td style="text-align: right; vertical-align: middle;">' + (new String(ttotal)) + '</td>'
																+ '</tr>';
														objRow.find('tbody').append(tag);

														view.clearContainer();
														view.appendRow(objRow);
													}
													else {

														FormUtils.showMessage('查無資料！');
													}
												}
											});
										});
									}
								);
							}
						}
					]
				});

				view.addDropdownMenu({

					"menuCaption": "資料維護",
					"items": [
						{
							"caption": "尺寸基本資料維護",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(createSYS00210);
							}
						},
						{
							"caption": "尺寸群組資料維護",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(createSYS00220);
							}
						},
						{
							"caption": "甜度基本資料維護",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(createSYS00230);
							}
						},
						{
							"caption": "甜度群組資料維護",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(createSYS00240);
							}
						},
						{
							"caption": "冰塊用量基本資料維護",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(createSYS00250);
							}
						},
						{
							"caption": "冰塊用量群組資料維護",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(createSYS00260);
							}
						},
						{
							"caption": "飲料資料維護",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(createSYS00270);
							}
						},
						{
							"caption": "商品資料維護",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								confirmAbortTran(

									function() {

										var rowId = 'rowId' + Math.random().toString(36).substr(2, 6);

										var vo;
										var index;

										var tag = '<div id="' + rowId + '" class="row">'
														+ '  <table class="table table-striped table-bordered">'
														+ '    <thead>'
														+ '      <tr style="display: inline-table; table-layout: fixed; width: 99%;">'
														+ '        <th style="text-align: center; vertical-align: middle;"><input type="button" class="btn btn-default" style="margin-bottom: 10px;" value="整批異動" disabled /></th>'
														+ '        <th style="text-align: center; vertical-align: middle;">商品編號</th>'
														+ '        <th style="text-align: center; vertical-align: middle;">商品名稱</th>'
														+ '        <th style="text-align: center; vertical-align: middle;">價格</th>'
														+ '      </tr>'
														+ '    </thead>'
														+ '  </table>'
														+ '</div>';
										var objRow = jQuery(tag);

										view.clearContainer();
										view.appendRow(objRow);

										if (arrProductsVO.length != 0) {

											objRow.find('table').append('<tbody style="position: absolute; overflow-y: scroll; height: 80%;"></tbody>');

											tag = '';
											for (index = 0; index < arrProductsVO.length; index++) {

												vo = arrProductsVO[index];
												tag += '<tr style="display: inline-table; table-layout: fixed; width: 99%;"><td style="text-align: center; vertical-align: middle;"><input type="checkbox" /></td><td style="vertical-align: middle;">' + vo.getProductCode() + '</td><td style="vertical-align: middle;">' + vo.getProductName() + '</td><td style="vertical-align: middle;"><a href="#">' + vo.getProductPrice() + '</a></td></tr>';
											}
											objRow.find('tbody').append(tag);
										}

										/**
										 *
										 * @see <a href="https://api.jquery.com/checked-selector/">:checked Selector | jQuery API Documentation</a>
										 *
										 */
										objRow.find('input[type="checkbox"]').on('click', function(event) {

											// event.stopPropagation();

											if (objRow.find('input:checked').length != 0) {

												objRow.find('input[type="button"]').prop('disabled', false);
											}
											else {

												objRow.find('input[type="button"]').prop('disabled', true);
											}
										});

										objRow.find('input[type="button"]').on('click', function(event) {

											FormUtils.showInputNumberModal({

												"title": "",
												"value": 10,
												"callback": function(value) {

													var productPrice = new Number(value);
													var productCode;
													var products;

													objRow.find('tbody > tr').each(function(index, element) {

														if (jQuery(element).find('input[type="checkbox"]').prop('checked')) {

															productCode = jQuery(element).find('td').eq(1).text();

															products = _.find(arrProductsVO, function(vo) {return vo.getProductCode() == productCode;});
															products.setProductPrice(productPrice);

															jQuery(element).find('td').eq(3).find('a').text(productPrice);
														}
													});

													setArrVOToLocalStorage(arrProductsVO, 'products');

													objRow.find('input[type="checkbox"]').prop('checked', false);
													objRow.find('input[type="button"]').prop('disabled', true);
												}
											})
										});

										/**
										 *
										 * @see <a href="http://vitalets.github.io/x-editable/">X-editable :: In-place editing with Twitter Bootstrap, jQuery UI or pure jQuery</a>
										 * @see <a href="https://github.com/vitalets/x-editable">vitalets/x-editable: In-place editing with Twitter Bootstrap, jQuery UI or pure jQuery</a>
										 * @see <a href="https://vitalets.github.io/bootstrap-editable/">Editable for Bootstrap</a>
										 * @see <a href="https://github.com/vitalets/bootstrap-editable">vitalets/bootstrap-editable: This plugin no longer supported! Please use x-editable instead!</a>
										 *
										 */
										objRow.find('a').editable({

											"type": "text",
											"title": "價格",
											"validate": function(value) {

												var result = '';

												if (!jQuery.isNumeric(value)) result = '輸入資料有誤！';

												return result;
											},
											"success": function(response, newValue) {

												var productPrice = new Number(newValue);
												var productCode;
												var products;

												(jQuery(this).parent()).parent().each(function(index, element) {

													jQuery(element).find('td').each(function(index, element) {

														if (index === 1) productCode = jQuery(element).text();
													});
												});

												products = _.find(arrProductsVO, function(vo) {return vo.getProductCode() == productCode;});
												products.setProductPrice(productPrice);

												setArrVOToLocalStorage(arrProductsVO, 'products');
											}
										});

										objRow.find('a').on('shown', function(event, editable) {

											/**
											 *
											 * Popup select all
											 *
											 * @see <a href="https://github.com/vitalets/x-editable/issues/330">On input focus, Select all text · Issue #330 · vitalets/x-editable</a>
											 *
											 * @description
											 *
											 * @comment
											 *
											 */
											editable.input.postrender = function() {

												editable.input.$input.val(jQuery(event.target).text());
												editable.input.$input.select();
											};

											// 限定輸入數值(keypress)？
										});
									}
								);
							}
						},
						{
							"caption": "資料匯出作業",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								FormUtils.showInputModal({

									"title": "檔案名稱",
									"defaultInputVaule": "RePOS.json",
									"callback": function(fileName) {

										var data = new Array();

										if (fileName != null) {

											if (fileName == '') {

												FormUtils.showMessage('檔案名稱不可空白！');
											}
											else {

												FormUtils.showProgressbar(

													'資料處理中，請稍候‧‧‧',
													function(closeProgressbar) {

														var arrSizes = new Array();
														var arrSizeGroups = new Array();
														var arrSizeGroupsDetail = new Array();

														var arrSugars = new Array();
														var arrSugarGroups = new Array();
														var arrSugarGroupsDetail = new Array();

														var arrIceDosages = new Array();
														var arrIceDosageGroups = new Array();
														var arrIceDosageGroupsDetail = new Array();

														var arrDrinks = new Array();
														var arrProducts = new Array();

														var localkey, tableName, voPath;
														var posKey;
														var posTrnLogs = {};
														var posTrnLogsDetail = {};

														data.push('{\n');

														// 基本資料
														arrSizesVO.forEach(function(currentValue, index) {arrSizes.push(currentValue.toJSONObject());});
														data.push('"sizes":' + JSON.stringify(arrSizes) + ',' + '\n');
														arrSizeGroupsVO.forEach(function(currentValue, index) {arrSizeGroups.push(currentValue.toJSONObject());});
														data.push('"size_groups":' + JSON.stringify(arrSizeGroups) + ',' + '\n');
														arrSizeGroupsDetailVO.forEach(function(currentValue, index) {arrSizeGroupsDetail.push(currentValue.toJSONObject());});
														data.push('"size_groups_detail":' + JSON.stringify(arrSizeGroupsDetail) + ',' + '\n');

														arrSugarsVO.forEach(function(currentValue, index) {arrSugars.push(currentValue.toJSONObject());});
														data.push('"sugars":' + JSON.stringify(arrSugars) + ',' + '\n');
														arrSugarGroupsVO.forEach(function(currentValue, index) {arrSugarGroups.push(currentValue.toJSONObject());});
														data.push('"sugar_groups":' + JSON.stringify(arrSugarGroups) + ',' + '\n');
														arrSugarGroupsDetailVO.forEach(function(currentValue, index) {arrSugarGroupsDetail.push(currentValue.toJSONObject());});
														data.push('"sugar_groups_detail":' + JSON.stringify(arrSugarGroupsDetail) + ',' + '\n');

														arrIceDosagesVO.forEach(function(currentValue, index) {arrIceDosages.push(currentValue.toJSONObject());});
														data.push('"ice_dosages":' + JSON.stringify(arrIceDosages) + ',' + '\n');
														arrIceDosageGroupsVO.forEach(function(currentValue, index) {arrIceDosageGroups.push(currentValue.toJSONObject());});
														data.push('"ice_dosage_groups":' + JSON.stringify(arrIceDosageGroups) + ',' + '\n');
														arrIceDosageGroupsDetailVO.forEach(function(currentValue, index) {arrIceDosageGroupsDetail.push(currentValue.toJSONObject());});
														data.push('"ice_dosage_groups_detail":' + JSON.stringify(arrIceDosageGroupsDetail) + ',' + '\n');

														arrDrinksVO.forEach(function(currentValue, index) {arrDrinks.push(currentValue.toJSONObject());});
														data.push('"drinks":' + JSON.stringify(arrDrinks) + ',' + '\n');
														arrProductsVO.forEach(function(currentValue, index) {arrProducts.push(currentValue.toJSONObject());});
														data.push('"products":' + JSON.stringify(arrProducts) + ',' + '\n');

														// 交易資料
														tableName = 'pos_trn_logs';
														voPath = localPath + Configurations.webServiceVOPath + tableName;
														for (localkey in localStorage) {

															if (localkey.startsWith(voPath + '/') == true) {

																posKey = localkey.substring(localkey.lastIndexOf('/') + 1);

																posTrnLogs[posKey] = JSON.parse(localStorage.getItem(localkey));
															}
														}
														data.push('"pos_trn_logs":', JSON.stringify(posTrnLogs) + ',' + '\n');

														tableName = 'pos_trn_logs_detail';
														voPath = localPath + Configurations.webServiceVOPath + tableName;
														for (localkey in localStorage) {

															if (localkey.startsWith(voPath + '/') == true) {

																posKey = localkey.substring(localkey.lastIndexOf('/') + 1);

																posTrnLogsDetail[posKey] = JSON.parse(localStorage.getItem(localkey));
															}
														}
														data.push('"pos_trn_logs_detail":', JSON.stringify(posTrnLogsDetail) + '\n');

														data.push('}');

														closeProgressbar();
													},
													function() {

														requirejs(["blob", "filesaver"], function() {

															var blob;

															try {

																blob = new Blob(data, {type: 'text/plain;charset=' + document.characterSet});

																if (!fileName.toLowerCase().endsWith('.json')) fileName += '.json';

																saveAs(blob, fileName);

																FormUtils.showMessage('資料匯出完成！！');
															}
															catch(event) {

																FormUtils.showMessage('存檔過程有誤！訊息：' + event.message);
															}
															finally {
															}
														});
													}
												);
											}
										}
									}
								});
							}
						},
						{
							"caption": "資料匯入作業",
							"click": function(event) {

								jQuery('.collapse').collapse('hide');

								FormUtils.showConfirmMessage(

									'資料匯入將會清除已存在之資料！！',
									function() {

										FormUtils.selectFileModal({

											"callback": function(file) {

												if (file != null) {

													FormUtils.showProgressbar(

														'資料處理中，請稍候‧‧‧',
														function(closeProgressbar) {

															requirejs(["tw.ace33022.vo.Sizes", "tw.ace33022.vo.SizeGroups", "tw.ace33022.vo.SizeGroupsDetail", "tw.ace33022.vo.Sugars", "tw.ace33022.vo.SugarGroups", "tw.ace33022.vo.SugarGroupsDetail", "tw.ace33022.vo.IceDosages", "tw.ace33022.vo.IceDosageGroups", "tw.ace33022.vo.IceDosageGroupsDetail", "tw.ace33022.vo.Drinks", "tw.ace33022.vo.Products"], function(Sizes, SizeGroups, SizeGroupsDetail, Sugars, SugarGroups, SugarGroupsDetail, IceDosages, IceDosageGroups, IceDosageGroupsDetail, Drinks, Products) {

																var fileReader = new FileReader();

																fileReader.onload = function(event) {

																	var data = JSON.parse(event.target.result);

																	var arrSizes, arrSizeGroups, arrSizeGroupsDetail;
																	var arrSugars, arrSugarGroups, arrSugarGroupsDetail;
																	var arrIceDosages, arrIceDosageGroups, arrIceDosageGroupsDetail;

																	var arrDrinks, arrProducts;

																	var tableName, voPath;

																	var key;
																	var posTrnLogs, posTrnLogsDetail;

																	for (key in localStorage) {

																		if (key.startsWith(localPath + Configurations.webServiceVOPath) == true) localStorage.removeItem(key);
																	}

																	tableName = 'sizes';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrSizes = data[tableName];
																	arrSizesVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrSizes));
																	setArrVOFromLocalStorage(tableName, Sizes, arrSizesVO);

																	tableName = 'size_groups';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrSizeGroups = data[tableName];
																	arrSizeGroupsVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrSizeGroups));
																	setArrVOFromLocalStorage(tableName, SizeGroups, arrSizeGroupsVO);

																	tableName = 'size_groups_detail';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrSizeGroupsDetail = data[tableName];
																	arrSizeGroupsDetailVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrSizeGroupsDetail));
																	setArrVOFromLocalStorage(tableName, SizeGroupsDetail, arrSizeGroupsDetailVO);

																	tableName = 'sugars';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrSugars = data[tableName];
																	arrSugarsVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrSugars));
																	setArrVOFromLocalStorage(tableName, Sugars, arrSugarsVO);

																	tableName = 'sugar_groups';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrSugarGroups = data[tableName];
																	arrSugarGroupsVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrSugarGroups));
																	setArrVOFromLocalStorage(tableName, SugarGroups, arrSugarGroupsVO);

																	tableName = 'sugar_groups_detail';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrSugarGroupsDetail = data[tableName];
																	arrSugarGroupsDetailVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrSugarGroupsDetail));
																	setArrVOFromLocalStorage(tableName, SugarGroupsDetail, arrSugarGroupsDetailVO);

																	tableName = 'ice_dosages';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrIceDosages = data[tableName];
																	arrIceDosagesVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrIceDosages));
																	setArrVOFromLocalStorage(tableName, IceDosages, arrIceDosagesVO);

																	tableName = 'ice_dosage_groups';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrIceDosageGroups = data[tableName];
																	arrIceDosageGroupsVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrIceDosageGroups));
																	setArrVOFromLocalStorage(tableName, IceDosageGroups, arrIceDosageGroupsVO);

																	tableName = 'ice_dosage_groups_detail';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrIceDosageGroupsDetail = data[tableName];
																	arrIceDosageGroupsDetailVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrIceDosageGroupsDetail));
																	setArrVOFromLocalStorage(tableName, IceDosageGroupsDetail, arrIceDosageGroupsDetailVO);

																	tableName = 'drinks';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrDrinks = data[tableName];
																	arrDrinksVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrDrinks));
																	setArrVOFromLocalStorage(tableName, Drinks, arrDrinksVO);

																	tableName = 'products';
																	voPath = localPath + Configurations.webServiceVOPath + tableName;
																	arrProducts = data[tableName];
																	arrProductsVO.length = 0;
																	localStorage.setItem(voPath, JSON.stringify(arrProducts));
																	setArrVOFromLocalStorage(tableName, Products, arrProductsVO);

																	tableName = 'pos_trn_logs';
																	posTrnLogs = data[tableName];
																	for (key in posTrnLogs) {

																		voPath = localPath + Configurations.webServiceVOPath + tableName + '/' + key;

																		localStorage.setItem(voPath, JSON.stringify(data[tableName][key]));
																	}

																	tableName = 'pos_trn_logs_detail';
																	posTrnLogsDetail = data[tableName];
																	for (key in posTrnLogsDetail) {

																		voPath = localPath + Configurations.webServiceVOPath + tableName + '/' + key;

																		localStorage.setItem(voPath, JSON.stringify(data[tableName][key]));
																	}
																};

																fileReader.readAsText(file);

																closeProgressbar();

																FormUtils.showMessage('資料匯入完成！！', function() {createPOS00020();});
															});
														}
													);
												}
											}
										});
									}
								);
							}
						}
					]
				});
			});
		}

		jQuery(document).ready(function() {

			usersVO.setUserAccount('ace33022');
			usersVO.setUserName('ace33022');

			if (('localStorage' in window) && (window['localStorage'] != null)) {

				ReUtils.beforeInitEnv(function() {
				
					var key;
					var loadInit = true;

					for (key in localStorage) {

						if (key.startsWith(localPath + Configurations.webServiceVOPath) == true) {

							loadInit = false;
							break;
						}
					}

					if (loadInit) {

						FormUtils.showConfirmMessage(

							'系統資料尚未建立，是否載入初始化資料？',
							function() {

								FormUtils.showProgressbar(

									'資料處理中，請稍候‧‧‧',
									function(closeProgressbar) {

										requirejs(["tw.ace33022.util.InitDataUtils"], function(InitDataUtils) {

											var tableName;

											tableName = 'sizes';
											arrSizesVO = InitDataUtils.getSizesVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrSizesVO, tableName);

											tableName = 'size_groups';
											arrSizeGroupsVO = InitDataUtils.getSizeGroupsVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrSizeGroupsVO, tableName);

											tableName = 'size_groups_detail';
											arrSizeGroupsDetailVO = InitDataUtils.getSizeGroupsDetailVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrSizeGroupsDetailVO, tableName);

											tableName = 'sugars';
											arrSugarsVO = InitDataUtils.getSugarsVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrSugarsVO, tableName);

											tableName = 'sugar_groups';
											arrSugarGroupsVO = InitDataUtils.getSugarGroupsVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrSugarGroupsVO, tableName);

											tableName = 'sugar_groups_detail';
											arrSugarGroupsDetailVO = InitDataUtils.getSugarGroupsDetailVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrSugarGroupsDetailVO, tableName);

											tableName = 'ice_dosages';
											arrIceDosagesVO = InitDataUtils.getIceDosagesVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrIceDosagesVO, tableName);

											tableName = 'ice_dosage_groups';
											arrIceDosageGroupsVO = InitDataUtils.getIceDosageGroupsVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrIceDosageGroupsVO, tableName);

											tableName = 'ice_dosage_groups_detail';
											arrIceDosageGroupsDetailVO = InitDataUtils.getIceDosageGroupsDetailVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrIceDosageGroupsDetailVO, tableName);

											tableName = 'drinks';
											arrDrinksVO = InitDataUtils.getDrinksVOArrayInitData(usersVO.getUserAccount());
											setArrVOToLocalStorage(arrDrinksVO, tableName);

											closeProgressbar();

											createPOS00020();
										});
									}
								);
							}
						);
					}
					else {

						requirejs(["tw.ace33022.vo.Sizes", "tw.ace33022.vo.SizeGroups", "tw.ace33022.vo.SizeGroupsDetail", "tw.ace33022.vo.Sugars", "tw.ace33022.vo.SugarGroups", "tw.ace33022.vo.SugarGroupsDetail", "tw.ace33022.vo.IceDosages", "tw.ace33022.vo.IceDosageGroups", "tw.ace33022.vo.IceDosageGroupsDetail", "tw.ace33022.vo.Drinks", "tw.ace33022.vo.Products"], function(Sizes, SizeGroups, SizeGroupsDetail, Sugars, SugarGroups, SugarGroupsDetail, IceDosages, IceDosageGroups, IceDosageGroupsDetail, Drinks, Products) {

							var tableName, voPath;

							tableName = 'sizes';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrSizesVO.length = 0;
								setArrVOFromLocalStorage(tableName, Sizes, arrSizesVO);
							}

							tableName = 'size_groups';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrSizeGroupsVO.length = 0;
								setArrVOFromLocalStorage(tableName, SizeGroups, arrSizeGroupsVO);
							}

							tableName = 'size_groups_detail';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrSizeGroupsDetailVO.length = 0;
								setArrVOFromLocalStorage(tableName, SizeGroupsDetail, arrSizeGroupsDetailVO);
							}

							tableName = 'sugars';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrSugarsVO.length = 0;
								setArrVOFromLocalStorage(tableName, Sugars, arrSugarsVO);
							}

							tableName = 'sugar_groups';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrSugarGroupsVO.length = 0;
								setArrVOFromLocalStorage(tableName, SugarGroups, arrSugarGroupsVO);
							}

							tableName = 'sugar_groups_detail';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrSugarGroupsDetailVO.length = 0;
								setArrVOFromLocalStorage(tableName, SugarGroupsDetail, arrSugarGroupsDetailVO);
							}

							tableName = 'ice_dosages';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrIceDosagesVO.length = 0;
								setArrVOFromLocalStorage(tableName, IceDosages, arrIceDosagesVO);
							}

							tableName = 'ice_dosage_groups';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrIceDosageGroupsVO.length = 0;
								setArrVOFromLocalStorage(tableName, IceDosageGroups, arrIceDosageGroupsVO);
							}

							tableName = 'ice_dosage_groups_detail';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrIceDosageGroupsDetailVO.length = 0;
								setArrVOFromLocalStorage(tableName, IceDosageGroupsDetail, arrIceDosageGroupsDetailVO);
							}

							tableName = 'drinks';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrDrinksVO.length = 0;
								setArrVOFromLocalStorage(tableName, Drinks, arrDrinksVO);
							}

							tableName = 'products';
							voPath = localPath + Configurations.webServiceVOPath + tableName;
							if (localStorage.getItem(voPath)) {

								arrProductsVO.length = 0;
								setArrVOFromLocalStorage(tableName, Products, arrProductsVO);
							}

							createPOS00020();
						});
					}
				});
			}
			else {

				FormUtils.showMessage('瀏覽器沒有Local Storage功能，無法正常執行程式！');	// 彈出無法關閉的錯誤訊息！
			}
		});	// document ready
	});	// requirejs
});