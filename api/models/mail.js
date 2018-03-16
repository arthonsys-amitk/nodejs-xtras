"use strict";

var exportFuns = {};

// returns "retrieve lost license key" email text
exportFuns.retrieveLostLicense = (name, licenseKey, productName, lostLicenseHelp)=>{
  let retText = `<!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="mail" style="max-width: 600px;width: 100%;padding: 0 20px;box-sizing: border-box;border: 1px solid #a5a5a5;font-family: Open Sans, sans-serif;letter-spacing: 0.5px;font-weight: 500;font-size: 16px;">
              <table style="width: 100%;border-spacing: 0;border-collapse: collapse;">
                  <thead>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr style="background-color: #ee7722; color: #fff;">
                          <td style="height: 115px;border: 1px solid #ee7722;">
                              <img src="http://zencolor.com/mail/images/zen-color-logo.png" style="margin-left: 20px;">
                          </td>
                          <td style="font-size: 35px;text-align: right;vertical-align: text-bottom;padding-top: 25px;text-transform: uppercase;font-weight: 600;border: 1px solid #ee7722;">
                              <p style="margin: 0;transform: scaleX(0.65);">Help Center</p>
                          </td>
                  </thead>
                  <tbody>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr>
                          <td colspan="2" style="border: 1px solid #a5a5a5; background-color: #f5f5f5; padding: 15px 20px;">
                              <p style="margin: 0 0 20px 0">Dear ${name},</p>
                              <p style="margin: 0 0 15px 0">Please find your License Key listed below:</p>
                              <p style="margin: 0 0 15px 0">
                                  <b>License Key: <span style="color: #ff0000">${licenseKey}</span></b>
                              </p>
                              <p style="margin: 0 0 15px 0">
                                  <b>zenColor<sup style="font-size: 8px;">TM</sup> ${productName}</b>
                              </p>
                              <p style="margin: 0">
                                  ${lostLicenseHelp}
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr>
                          <td colspan="2" style="border: 1px solid #a5a5a5; background-color: #f5f5f5; padding: 10px 20px;">
                              For further assistance, please visit our <a href="https://zencolor.com/help_center/" style="color: #4a90e2;text-decoration: none">help-center</a>.
                          </td>
                      </tr>
                      <tr>
                          <td colspan="2" style="font-size: 12px;text-align: center;padding: 18px 0;">
                              &copy; <span>zenColor<sup style="font-size: 7px;">TM</sup> Company LLC, 2018 - All Rights Reserved | <a href="http://www.zencolor.com" style="text-decoration: none;color: #000;">www.zencolor.com</a></span>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </body>
  </html>`;

  return retText;
};

// returns "reset password" email text
exportFuns.resetPassword = (name, link)=>{
  let retText = `<!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="mail" style="max-width: 600px;width: 100%;padding: 0 20px;box-sizing: border-box;border: 1px solid #a5a5a5;font-family: Open Sans, sans-serif;letter-spacing: 0.5px;font-weight: 500;font-size: 16px;">
              <table style="width: 100%;border-spacing: 0;border-collapse: collapse;">
                  <thead>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr style="background-color: #ee7722; color: #fff;">
                          <td style="height: 115px;border: 1px solid #ee7722;">
                              <img src="http://zencolor.com/mail/images/zen-color-logo.png" style="margin-left: 20px;">
                          </td>
                          <td style="font-size: 35px;text-align: right;vertical-align: text-bottom;padding-top: 25px;text-transform: uppercase;font-weight: 600;border: 1px solid #ee7722;">
                              <p style="margin: 0;transform: scaleX(0.65);">Internal Memo</p>
                          </td>
                  </thead>
                  <tbody>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr>
                          <td colspan="2" style="border: 1px solid #a5a5a5; background-color: #f5f5f5; padding: 15px 20px;">
                              <p style="margin: 0 0 20px 0">Dear ${name},</p>
                              <p style="margin: 0 0 20px 0">
                                  You have requested to reset your password. Click the<br />
                                  following link to <a href="${link}" style="color: #4a90e2;text-decoration: none">Reset Password</a>.
                              </p>
                              <p style="margin:0;font-size: 12px">
                                  To protect your account this access link is only valid for use one time.
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr>
                          <td colspan="2" style="border: 1px solid #a5a5a5; background-color: #f5f5f5; padding: 15px 20px;">
                              If you did not request this passowrd reset, you can ignore<br />
                              this email.
                          </td>
                      </tr>
                      <tr>
                          <td colspan="2" style="font-size: 12px;text-align: center;padding: 18px 0;">
                              &copy; <span>zenColor<sup style="font-size: 7px;">TM</sup> Company LLC, 2018 - All Rights Reserved | <a href="http://www.zencolor.com" style="text-decoration: none;color: #000;">www.zencolor.com</a></span>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </body>
  </html>`;

  return retText;
};

var numberAsMoney = (n, currency)=>{
  return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}


// returns "order confirmation" email text
exportFuns.orderConfirmation = (purchase, item, product)=>{
  let retText = `<!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="mail" style="max-width: 600px;width: 100%;padding: 0 20px;box-sizing: border-box;border: 1px solid #a5a5a5;font-family: Open Sans, sans-serif;letter-spacing: 0.5px;font-weight: 500;font-size: 16px;">
              <table style="width: 100%;border-spacing: 0;border-collapse: collapse;">
                  <thead>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr style="background-color: #ee7722; color: #fff;">
                          <td style="height: 115px;border: 1px solid #ee7722;">
                              <img src="http://zencolor.com/mail/images/zen-color-logo.png" style="margin-left: 20px;">
                          </td>
                          <td style="font-size: 35px;text-align: right;vertical-align: text-bottom;padding-top: 25px;text-transform: uppercase;font-weight: 600;border: 1px solid #ee7722;">
                              <p style="margin: 0;transform: scaleX(0.65);">Your Order</p>
                          </td>
                  </thead>
                  <tbody>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr>
                          <td colspan="2" style="border: 1px solid #a5a5a5; background-color: #f5f5f5; padding: 15px 20px;">
                              <p style="margin: 0 0 20px 0">Dear ${purchase.firstName} ${purchase.lastName},</p>

                              <p style="margin: 0">
                                  Thank you for your order. Below is your product delivery information.
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr>
                          <td colspan="2" style="border: 1px solid #a5a5a5; background-color: #f5f5f5; padding: 15px 20px;">
                              <p style="margin: 0 0 20px 0">Your Order:</p>
                              <p style="margin: 0 0 15px 0">
                                  <b>zenColor<sup style="font-size: 8px;">TM</sup> ${item.productName} <span style="margin-left:50px;">${numberAsMoney(product.price, '$')} x ${item.quantity}</span></b>
                              </p>
                              <p style="margin: 0 0 15px 0">Subscription renews every ${product.licenseMonths} months. Next charge: ${item.productKeyExpiration} ${numberAsMoney(product.price, '$')}<br />
                                  <a href="#" style="color: #4a90e2;text-decoration: none">Terms of Sale and Subsciption Management</a>
                              </p>
                              <p style="margin: 0 0 15px 0;font-size: 20px;">
                                  <b>License Key: <span style="color: #ff0000">${item.productKey}</span></b>
                              </p>
                              <p style="margin: 0">
                                  The License Key is a serial number that is used to authenticate and
                                  activate (or deactivate) your zencolor<sup style="font-size: 8px;">TM</sup> ${item.productName} software.
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr>
                          <td colspan="2" style="border: 1px solid #a5a5a5; background-color: #f5f5f5; padding: 15px 20px;">
                              <p style="margin: 0 0 20px 0"><b>Installation Instructions</b></p>
                              <p style="margin: 0 0 15px 0">
                                  ${product.installationText}
                              </p>`;
        if (product.downloadable){
          retText = retText + `<p style="margin: 0">
              To download the ${item.productName} installer <a href="${product.url}" style="color: #4a90e2;text-decoration: none">click here</a>.
          </p>`;
        }

        retText = retText +
                          `</td>
                      </tr>
                      <tr>
                          <td style="height: 25px;" colspan="2"></td>
                      </tr>
                      <tr>
                          <td colspan="2" style="border: 1px solid #a5a5a5; background-color: #f5f5f5; padding: 10px 20px;">
                              For further assistance, please visit our <a href="https://zencolor.com/help_center/" style="color: #4a90e2;text-decoration: none">help-center</a>.
                          </td>
                      </tr>
                      <tr>
                          <td colspan="2" style="font-size: 12px;text-align: center;padding: 18px 0;">
                              &copy; <span>zenColor<sup style="font-size: 7px;">TM</sup> Company LLC, 2018 - All Rights Reserved | <a href="http://www.zencolor.com" style="text-decoration: none;color: #000;">www.zencolor.com</a></span>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </body>
  </html>`;

  return retText;
};

module.exports = exportFuns;
