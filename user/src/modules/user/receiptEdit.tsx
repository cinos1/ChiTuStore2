import { Page, defaultNavBar, app } from 'site';
import { ReceiptInfo, ShopService } from 'services';
import FormValidator = require('validate');
import { RegionsPageRouteValues } from 'modules/user/regions';

let { PageComponent, PageHeader, PageView, Button } = controls;

export default async function (page: Page) {

    let shop = page.createService(ShopService);

    class ReceiptEditPage extends React.Component<{ receiptInfo?: ReceiptInfo }, { receiptInfo: ReceiptInfo }>{
        private validator: FormValidator;
        constructor(props) {
            super(props);

            let receiptInfo = this.props.receiptInfo || {} as ReceiptInfo;
            this.state = { receiptInfo: receiptInfo };
        }
        componentDidMount() {
            let fromElement = page.element.querySelector('form') as HTMLElement;
            this.validator = new FormValidator(fromElement, [
                { name: 'Name', display: '地址名称', rules: 'required' },
                { name: 'Consignee', display: '收货人', rules: 'required' },
                { name: 'Mobile', display: '手机号码', rules: 'required' },
                { name: 'Address', display: '详细地址', rules: 'required' },
                { name: 'RegionId', display: '地区', rules: 'required' },
            ]);
            this.validator.setMessage('Name.required', '请输入地址名称');
            this.validator.setMessage('Consignee.required', '请输入收货人姓名');
            this.validator.setMessage(`Mobile.required`, '请输入手机号码');
            this.validator.setMessage('Address.required', '请输入详细地址');
            this.validator.setMessage('RegionId.required', '请选择地区');
        }
        onInputChange(event: React.FormEvent) {
            let input = event.target as HTMLInputElement;
            let value: any;
            if (input.type == 'checkbox') {
                value = input.checked;
            }
            else {
                value = input.value;
            }

            this.state.receiptInfo[input.name] = value;
            this.setState(this.state);
        }
        saveReceipt(): Promise<any> {
            if (!this.validator.validateForm()) {
                return Promise.reject<any>(null);
            }
            return shop.saveReceiptInfo(this.state.receiptInfo);
        }
        changeRegion() {
            let r = this.state.receiptInfo;
            let routeValues: RegionsPageRouteValues = {
                province: { Id: r.ProvinceId, Name: r.ProvinceName }, city: { Id: r.CityId, Name: r.CityName },
                country: { Id: r.CountyId, Name: r.CountyName },
                selecteRegion: (province, city, country) => {
                    r.ProvinceName = province.Name;
                    r.ProvinceId = province.Id;
                    r.CityName = city.Name;
                    r.CityId = city.Id;
                    r.CountyName = country.Name;
                    r.CountyId = country.Id;
                    r.RegionId = country.Id;
                    this.setState(this.state);
                }
            };
            app.showPage('user_regions', routeValues);
        }
        render() {
            let ReceiptInfo = this.state.receiptInfo;
            return (
                <PageComponent>
                    <PageHeader>
                        {defaultNavBar({ title: '编辑地址' })}
                    </PageHeader>
                    <PageView>
                        <div className="container">
                            <form data-bind="with:receipt" className="form-horizontal">
                                <div className="form-group">
                                    <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                        <span className="color-red">*</span> 地址名称
                                    </label>
                                    <div className="col-xs-9">
                                        <input type="text" name="Name" className="form-control"
                                            value={receiptInfo.Name || ''}
                                            onChange={(e) => this.onInputChange(e)}
                                            placeholder="方便区分收货地址，例如：公司、家" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                        <span className="color-red">*</span> 收货人
                                    </label>
                                    <div className="col-xs-9">
                                        <input type="text" name="Consignee" className="form-control"
                                            value={receiptInfo.Consignee || ''}
                                            onChange={(e) => this.onInputChange(e)}
                                            placeholder="请填写收货人的姓名" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                        <span className="color-red">*</span> 手机号码
                                    </label>
                                    <div className="col-xs-9">
                                        <input type="text" name="Mobile" className="form-control"
                                            value={receiptInfo.Mobile || ''}
                                            onChange={(e) => this.onInputChange(e)}
                                            data-bind="value:Mobile,textInput:Mobile" placeholder="请填写收货人手机号码" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                        <span className="color-red">*</span> 所在地区
                                    </label>
                                    <div className="col-xs-9 pull-right" style={{ textAlign: 'right' }}
                                        onClick={() => this.changeRegion()}>
                                        <span style={{ paddingRight: 10 }}>
                                            {receiptInfo.ProvinceName} {receiptInfo.CityName} {receiptInfo.CountyName}
                                            <input type="hidden" value={receiptInfo.RegionId || ''} readOnly={true} />
                                        </span>
                                        <i className="icon-chevron-right"></i>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                        <span className="color-red">*</span> 详细地址
                                    </label>
                                    <div className="col-xs-9">
                                        <input type="text" name="Address" className="form-control"
                                            value={receiptInfo.Address || ''}
                                            onChange={(e) => this.onInputChange(e)}
                                            data-bind="value:Address,textInput:Address" placeholder="请填写收货地址" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                        邮编
                                    </label>
                                    <div className="col-xs-9">
                                        <input type="text" name="PostalCode" className="form-control"
                                            placeholder="请输入邮政编码"
                                            value={receiptInfo.PostalCode || ''}
                                            onChange={(e) => this.onInputChange(e)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                        固定电话
                                    </label>
                                    <div className="col-xs-9">
                                        <input name="Phone" className="form-control" placeholder="请输入固定电话号码"
                                            value={receiptInfo.Phone || ''} onChange={(e) => this.onInputChange(e)} />
                                    </div>
                                </div>
                                <div className="form-group" style={{ display: 'block' }}>
                                    <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                        设为默认
                                    </label>
                                    <div className="col-xs-9 pull-right" style={{ textAlign: 'right' }}>
                                        <input type="checkbox" name="IsDefault" checked={receiptInfo.IsDefault}
                                            onChange={(e) => this.onInputChange(e)} />
                                    </div>
                                </div>
                            </form>

                            <div className="form-group">
                                <span className="color-red">*</span>为必填项目
                            </div>
                            <div className="form-group">
                                <a className="btn btn-primary btn-block" onClick={() => this.saveReceipt()}>保存</a>
                            </div>
                        </div>
                    </PageView>
                </PageComponent>
            );
        }
    }

    let receiptInfo: ReceiptInfo;
    let id = page.routeData.values.id;
    if (id) {
        receiptInfo = await shop.receiptInfo(id);
    }
    ReactDOM.render(<ReceiptEditPage receiptInfo={receiptInfo} />, page.element);

}