//
//  WebViewController.swift
//  WeightWatcher
//
//  Created by Duy Khanh on 8/7/24.
//

import UIKit
import WebKit

class WebViewController: UIViewController, WKNavigationDelegate{
  
  var url: String?
  
  @IBOutlet weak var webView: WKWebView!
  
  @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    loadUrl()
  }
  
  func loadUrl() {
    guard let link = url else { return }
    guard let url = URL(string: link) else { return }
    
    let request = URLRequest(url: url)
    
    if webView == nil {
      webView = WKWebView(frame: .zero)
      webView.translatesAutoresizingMaskIntoConstraints = false
      self.view.addSubview(webView)
      
      NSLayoutConstraint.activate([
        webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
        webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
        webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        webView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
      ])
      
      webView.navigationDelegate = self
    }
    webView.load(request)
  }
}
