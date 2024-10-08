import 'dart:convert'; // Để giải mã JSON
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:supershop_app/features/profile/context/profile_context.dart';
import 'package:supershop_app/models/account/account.dart';
import 'package:supershop_app/models/auth/device_info.dart';
import 'package:supershop_app/utils/api/Authentication/auth.api.dart';

class QRScannerScreen extends StatefulWidget {
  @override
  _QRScannerScreenState createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  Barcode? result;
  bool isProcessing = false;
  String? errorMessage;
  AuthApi _authApi = AuthApi();
  DeviceInfo? scannedDeviceInfo;
  String? code;

  @override
  void initState() {
    super.initState();
  }

  @override
  void reassemble() {
    super.reassemble();
    if (controller != null) {
      controller!.pauseCamera();
      controller!.resumeCamera();
    }
  }

  @override
  Widget build(BuildContext context) {
    final profileContext = Provider.of<ProfileContext>(context);
    final account = profileContext.account;
    return Scaffold(
      appBar: AppBar(
        title: Text("Quét QR Code"),
        backgroundColor: Colors.black,
      ),
      body: Stack(
        children: [
          QRView(
            key: qrKey,
            onQRViewCreated: (controller) => _onQRViewCreated(controller),
            overlay: QrScannerOverlayShape(
              borderColor: result != null ? Colors.green : Colors.red,
              borderRadius: 10,
              borderLength: 30,
              borderWidth: 15,
              cutOutSize: MediaQuery.of(context).size.width * 0.7,
            ),
          ),
          _buildInfoOverlay(account),
        ],
      ),
    );
  }

  Widget _buildInfoOverlay(Account? account) {
    return Positioned(
      bottom: 20,
      left: 20,
      right: 20,
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.7),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (scannedDeviceInfo != null) ...[
                Text(
                  "Thông tin thiết bị đã quét:",
                  style: TextStyle(
                    color: Colors.green,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                _buildDeviceInfoRow(
                    "Loại thiết bị", scannedDeviceInfo!.deviceType),
                _buildDeviceInfoRow("Quốc gia", scannedDeviceInfo!.country),
                _buildDeviceInfoRow("Thành phố", scannedDeviceInfo!.city),
                SizedBox(height: 20),
                Text(
                  "Bạn có muốn đăng nhập trên thiết bị này?",
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
                SizedBox(height: 20),
                _buildActionButtons(account),
              ] else if (errorMessage != null) ...[
                Text(
                  errorMessage == "Exception: QR code đã quá hạn."
                      ? "Mã QR code hết hạn, vui lòng quét mã mới"
                      : "Lỗi: $errorMessage",
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 16,
                  ),
                ),
                if (errorMessage == "QR code đã quá hạn.") ...[
                  SizedBox(height: 20),
                  _buildRetryButton(),
                ],
              ] else ...[
                Text(
                  "Đang chờ quét QR code...",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDeviceInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Text(
            "$label: ",
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: Colors.white),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(Account? account) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        ElevatedButton(
          onPressed: () => _showLoginConfirmationDialog(account),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.green,
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          ),
          child: Text(
            "Đăng nhập",
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
            ),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            controller?.resumeCamera();
            setState(() {
              scannedDeviceInfo = null;
              errorMessage = null;
            });
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red,
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          ),
          child: Text(
            "Quét lại",
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRetryButton() {
    return ElevatedButton(
      onPressed: () {
        setState(() {
          errorMessage = null;
        });
        controller?.resumeCamera();
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.red,
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      ),
      child: Text(
        "Quét lại",
        style: TextStyle(
          color: Colors.white,
          fontSize: 16,
        ),
      ),
    );
  }

  void _showLoginConfirmationDialog(Account? account) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Xác nhận đăng nhập"),
          content: Text("Bạn có muốn thực hiện đăng nhập trên thiết bị này?"),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text("Hủy"),
            ),
            TextButton(
              onPressed: () {
                print("=====> Code from submit button: ${code}");
                Navigator.of(context).pop();
                if (account != null &&
                    scannedDeviceInfo != null &&
                    code != null) {
                  _performLogin(account, scannedDeviceInfo!, code!);
                }
              },
              child: Text("Đồng ý"),
            ),
          ],
        );
      },
    );
  }

  void _performLogin(Account account, DeviceInfo device, String code) async {
    await _authApi.qrLoginForReact(account, device, code);
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) async {
      if (scanData.code != null && !isProcessing) {
        setState(() {
          result = scanData;
          isProcessing = true;
        });

        try {
          Map<String, dynamic> json = jsonDecode(scanData.code!);
          if (json.containsKey('deviceInfo')) {
            DeviceInfo deviceInfo = DeviceInfo.fromJson(json['deviceInfo']);
            String code = json['code'];
            if (json.containsKey('createdAt')) {
              DateTime createdAt = DateTime.parse(json['createdAt']);
              DateTime now = DateTime.now();

              if (now.difference(createdAt).inMinutes > 5) {
                throw Exception("QR code đã quá hạn.");
              }
            }
            controller.pauseCamera();
            setState(() {
              scannedDeviceInfo = deviceInfo;
              errorMessage = null;
              this.code = code;
            });
          } else {
            throw Exception("Không tìm thấy 'deviceInfo' trong dữ liệu QR.");
          }
        } catch (e) {
          setState(() {
            errorMessage = e.toString();
          });
        } finally {
          setState(() {
            isProcessing = false;
          });
        }
      }
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}
