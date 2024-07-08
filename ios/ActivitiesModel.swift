//
//  ActivitiesModel.swift
//  WeightWatcher
//
//  Created by Duy Khanh on 8/7/24.
//

import Foundation

class ActivitiesModel{
    var teacher: String = ""
    var content: String = ""
    var type: String = ""
    var image: String = ""
    var link: String = ""
    
    init(teacher: String, content: String, type: String, image: String, link: String) {
        self.teacher = teacher
        self.content = content
        self.type = type
        self.image = image
        self.link = link
    }
}
