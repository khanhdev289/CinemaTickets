//
//  ViewViewController.swift
//  WeightWatcher
//
//  Created by Duy Khanh on 8/7/24.
//

import UIKit

class ViewViewController: UIViewController {
    

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    func setupWebView() {
           webView = WKWebView(frame: self.view.frame)
           self.view.addSubview(webView)
       }

    func loadUrl() {
           guard let urlString = url, let url = URL(string: urlString) else { return }
           let request = URLRequest(url: url)
           webView.load(request)
       }

}
