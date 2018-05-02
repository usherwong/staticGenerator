---
title: 经典面试题
---

## Vue 中 Emit On Once Off 实现

```javascript
  var EventEmiter = function (){
    this._events = {};
  };
  EventEmiter.prototype.on = function (event, cb){
    if (Array.isArray(event)){
      for (let i = 0, l = event.length; i < l; i++){
        this.on(event[i], cb);
      }
    } else {
      (this._events[event] || (this._events[event] = [])).push(cb);
    }
    return this;
  };
  EventEmiter.prototype.once = function (event, cb){
    function on () {
      this.off(event, cb);
      cb.apply(this, arguments);
    }
    on.fn = cb;
    this.on(event, on);
    return this;
  };
  EventEmiter.prototype.off = function (event, cb){
    if (!arguments.length){
      this._events = Object.create(null);
      return this;
    }
    if (Array.isArray(event)){
      for (let i = 0, l = event.length; i < l; i++){
        this.off(event[i],cb);
      }
      return this;
    }
    if (!cb){
      this._events[event] = null;
      return this;
    }
    if (cb){
      let cbs = this._events[event];
      let i = cbs.length;
      while(i--){
        if (cb === cbs[i] || cb === cbs[i].fn){
          cbs.splice(i, 1);
          break;
        }
      }
      return this;
    }
  };
  EventEmiter.prototype.emit = function (event){
    let cbs = this._events[event];
    let args = Array.prototype.slice.call(arguments, 1);
    if (cbs){
      for (let i = 0, l = cbs.length; i < l; i++){
        cbs[i].apply(this,args);
      }
    }
  };

```

## js bind 实现机制？手写一个 bind 方法？

```javascript
if (typeof Function.prototype.bind === "undefined"){
  Function.prototype.bind = function (thisArgs){
    var fn = this,
        slice = Array.prototype.slice,
        args = slice.call(arguments, 1);
    return function (){
      return fn.apply(thisArgs, args.concat(slice.call(arguments)));
    }
  }
}
```

## 基于 Localstorage 设计一个 1M 的缓存系统，需要实现缓存淘汰机制

```javascript
class Store {
  constructor() {
    let store = localStorage.getItem('cache')
    if (!store) {
      store = {
        maxSize: 1024 * 1024,
        size: 0
      }
    }
    this.store = store
  }
  set(key, value, expire) {
    this.store[key] = {
      date: Date.now(),
      expire
    }
    let size = sizeof(JSON.stringify(value))
    if (this.store.maxSize < size + this.store.size) {
      console.log('超了-----------');
      var keys = Object.keys(this.store);
      // 时间排序
      keys = keys.sort((a, b) => {
        let item1 = this.store[a], item2 = this.store[b];
        return item2.date - item1.date;
      });
      while (size + this.store.size > this.store.maxSize) {
        delete this.store[keys[keys.length - 1]]
      }
    }
    this.store.size += size
    this.store[key] = value
    localStorage.setItem('cache', this.store)
  }
  get(key) {
    let d = this.store[key]
    if (!d) {
        console.log('找不到该属性');
        return
    }
    if (d.expire > Date.now) {
      console.log('过期删除');
      delete this.store[key]
      localStorage.setItem('cache', this.store)
    } else {
      return d
    }
  }
  sizeOf(str, charset) {
    var total = 0,
      charCode,
      i,
      len;
    charset = charset ? charset.toLowerCase() : '';
    if (charset === 'utf-16' || charset === 'utf16') {
      for (i = 0, len = str.length; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode <= 0xffff) {
          total += 2;
        } else {
          total += 4;
        }
      }
    } else {
      for (i = 0, len = str.length; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode <= 0x007f) {
          total += 1;
        } else if (charCode <= 0x07ff) {
          total += 2;
        } else if (charCode <= 0xffff) {
          total += 3;
        } else {
          total += 4;
        }
      }
    }
    return total;
  }
}
```