# Quy tắc viết code

## 1. Tuân Thủ Quy Ước Về Tên

1. Biến và Hàm: Sử dụng camelCase cho biến và hàm (ví dụ: myVariable, calculateTotal()).
2. Lớp và Đối Tượng: Sử dụng PascalCase cho tên lớp và đối tượng (ví dụ: MyClass, MyObject).

## 2. Tổ Chức Mã Nguồn

1. Tổ Chức Thư Mục: Tổ chức thư mục một cách có tổ chức và dễ đọc.
2. Module và Components: Tách code thành các module và components để tăng sự tái sử dụng và dễ duy trì.
3. Tóm Lược Code: Sử dụng comment để mô tả các đoạn mã quan trọng.
4. Làm đẹp code: Căn chỉnh lại code trước khi đẩy code lên github

## 3. Xử Lý Ngoại Lệ

Bắt và Xử Lý Ngoại Lệ Đầy Đủ: Bảo đảm rằng mọi ngoại lệ đều được bắt và xử lý một cách đầy đủ để tránh lỗi không mong muốn.

## 4. Sử Dụng ES6/ES7

Sử Dụng Arrow Functions: Sử dụng arrow functions khi có thể để giảm sự phức tạp của đoạn mã.

## 5. Đặt Chú Ý Đến Hiệu Năng

Tối Ưu Hóa Truy Vấn: Tránh các truy vấn không hiệu quả, và sử dụng chỉ cần thiết các trường trong truy vấn.

## 6. Hạn Chế Lồng If vào Nhau

Hạn Chế Lồng If vào Nhau: Tránh lồng quá nhiều câu lệnh if vào nhau để giảm sự phức tạp và làm cho code dễ đọc hơn.
Sử Dụng Early Return: Khi có thể, sử dụng cách trả về sớm để tránh lồng quá nhiều lệnh if. Ví dụ:

```bash
if (!<trường hợp sai>) {
  return;
}
// Xử lý cho trường hợp đúng
```

## 7. Quy tắc git

1. Các tính năng mới nên được phát triển trong một nhánh riêng và sau đó tạo một yêu cầu kéo (pull request) để hợp nhất nó vào nhánh main.
2. Yêu cầu kéo nên được xem xét bởi ít nhất một người khác trước khi hợp nhất vào nhánh main.
3. Quy ước đặt tên cho branch là feature/ hoặc viết tắt feat/. Đối với sửa lỗi bug, sử dụng fix/ hoặc hotfix/.
4. Thông điệp commit nên mô tả các thay đổi trong commit. Đừng viết commit mà không mô tả các thay đổi. Ví dụ, fix bug không phải là một thông điệp commit tốt. Thay vào đó, hãy viết fix: .
5. Giữ thông điệp commit ngắn gọn và súc tích. Nếu bạn cần viết một thông điệp commit dài, hãy viết trong phần mô tả của yêu cầu kéo thay vì trong thông điệp commit.

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
