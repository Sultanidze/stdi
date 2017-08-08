(function () {
    angular.module("stdi.profile", ["stdi.util", "ui.mask", "ui.bootstrap", "stdi.fileupload"]).controller("UserSettingsCtrl", ["HttpSvc", "Helpers", "LoaderSvc", "ScrollSvc", function (i, t, s, e) {
        var n;
        n = this, this.$onInit = function () {
            return this.error = {email: ""}, this.state = angular.copy(STDI.userSettings), this.birthday = this.state.birthday ? moment(this.state.birthday, "DD.MM.YYYY").toDate() : void 0, this.alert = void 0
        }, this.isEmptyProfile = function () {
            return !(this.state.name && this.state.last_name && this.state.gender && this.state.birthday && this.state.phone)
        }, this.btnDisabled = function () {
            return this.frm.$invalid || !!this.state.pwd1 != !!this.state.pwd2
        }, this.save = function () {
            return this.state.pwd1 && this.state.pwd1 !== this.state.pwd2 && this.frm.pwd2.$setValidity("custom", !1), t.ensureValid(this)(function () {
                var l;
                return l = angular.copy(this.state), l.birthday = t.dateToString(this.birthday), l.password = l.pwd1, l["password-confirm"] = l.pwd2, delete l.iin, delete l.pwd1, delete l.pwd2, s.withLoader("profile", i.postForm("/api/1.0/profile-update", l).then(function (i) {
                    var s, l, o;
                    if (100 === i.code && i.field) {
                        l = i.field;
                        for (s in l) o = l[s], n.error[s] = o, n.frm[s].$setValidity("custom", !1);
                        t.scrollToErrors(n.frm)
                    } else !i.code && i.alert && (n.alert = i.alert, e.scrollToTop())
                }))
            })
        }
    }]).component("stdiCompensDocList", {
        controller: "ProfileDocListCmpCtrl",
        templateUrl: "t/personal/compensations/doc_list_cmp",
        bindings: {act: "@"}
    }).controller("ProfileDocListCmpCtrl", ["$attrs", function (i) {
        var t;
        t = this, this.$onInit = function () {
            return this.docs = JSON.parse(i.docs)
        }
    }]).component("stdiCompensFileUpload", {
        bindings: {act: "<", doc: "<", files: "<"},
        template: '<div file-upload=\'options\'>\n  <div class="files-list clearfix">\n    <div class="files-list-item" ng-repeat=\'file in queue\'>\n\n      <svg ng-show=\'file.$state() == "pending"\' class="icon icon-file icon-file-upload"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/bitrix/templates/stdi/img/icons.svg#icon-file-upload"></use></svg>\n      <div ng-show=\'file.$state() == "pending"\' class="file-uploading">\n        <div class="file-progress" file-upload-progress="file.$progress()"><div ng-style="{width: num + \'%\'}"></div></div>\n        <i>{{file.name}}</i>\n      </div>\n\n      <svg ng-show=\'file.id\' class="icon icon-file icon-file-success"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/bitrix/templates/stdi/img/icons.svg#icon-file-success"></use></svg>\n      <svg ng-show=\'file.error\' uib-tooltip="{{::file.error}}" class="icon icon-file icon-file-error"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/bitrix/templates/stdi/img/icons.svg#icon-file-error"></use></svg>\n\n      <div ng-hide=\'file.$state() == "pending"\' class="file-name">{{file.name}}</div>\n\n      <a ng-controller="CancelUploadCtrl" ng-click="file.$cancel()" ng-show="!file.id && file.$cancel"><svg class="icon icon-delete"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/bitrix/templates/stdi/img/icons.svg#icon-delete"></use></svg></a>\n\n    </div>\n  </div>\n\n  <div class="btn-file-upload">\n    <a class="link-alt link-with-icon" href="">\n      <svg class="icon icon-plus"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/bitrix/templates/stdi/img/icons.svg#icon-plus"></use></svg>\n      <span>Выбрать файлы</span>\n    </a>\n    <input type=\'file\' multiple />\n  </div>\n</div>',
        controller: ["$scope", function (i) {
            return i.queue = angular.copy(this.files) || [], i.options = {
                url: "/api/1.0/linkfile2act",
                formData: {action: "upload", act: this.act, doc: this.doc}
            }
        }]
    })
}).call(this);