function w(){}function j(t,n){for(const e in n)t[e]=n[e];return t}function E(t){return t()}function A(){return Object.create(null)}function v(t){t.forEach(E)}function D(t){return typeof t=="function"}function F(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}let i;function P(t,n){return t===n?!0:(i||(i=document.createElement("a")),i.href=n,t===i.href)}function S(t){return Object.keys(t).length===0}function m(t,...n){if(t==null){for(const r of n)r(void 0);return w}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function U(t){let n;return m(t,e=>n=e)(),n}function B(t,n,e){t.$$.on_destroy.push(m(n,e))}function C(t,n,e,r){if(t){const o=x(t,n,e,r);return t[0](o)}}function x(t,n,e,r){return t[1]&&r?j(e.ctx.slice(),t[1](r(n))):e.ctx}function G(t,n,e,r){if(t[2]&&r){const o=t[2](r(e));if(n.dirty===void 0)return o;if(typeof o=="object"){const a=[],_=Math.max(n.dirty.length,o.length);for(let s=0;s<_;s+=1)a[s]=n.dirty[s]|o[s];return a}return n.dirty|o}return n.dirty}function H(t,n,e,r,o,a){if(o){const _=x(n,e,r,a);t.p(_,o)}}function I(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let r=0;r<e;r++)n[r]=-1;return n}return-1}function J(t){return t??""}let f;function h(t){f=t}function g(){if(!f)throw new Error("Function called outside component initialization");return f}function K(t){g().$$.on_mount.push(t)}function L(t){g().$$.after_update.push(t)}function N(t){g().$$.on_destroy.push(t)}const l=[],b=[];let c=[];const y=[],k=Promise.resolve();let p=!1;function q(){p||(p=!0,k.then(z))}function Q(){return q(),k}function O(t){c.push(t)}const d=new Set;let u=0;function z(){if(u!==0)return;const t=f;do{try{for(;u<l.length;){const n=l[u];u++,h(n),M(n.$$)}}catch(n){throw l.length=0,u=0,n}for(h(null),l.length=0,u=0;b.length;)b.pop()();for(let n=0;n<c.length;n+=1){const e=c[n];d.has(e)||(d.add(e),e())}c.length=0}while(l.length);for(;y.length;)y.pop()();p=!1,d.clear(),h(t)}function M(t){if(t.fragment!==null){t.update(),v(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(O)}}function R(t){const n=[],e=[];c.forEach(r=>t.indexOf(r)===-1?n.push(r):e.push(r)),e.forEach(r=>r()),c=n}export{J as A,G as a,B as b,C as c,L as d,b as e,A as f,I as g,z as h,D as i,S as j,O as k,R as l,f as m,w as n,K as o,h as p,E as q,v as r,F as s,Q as t,H as u,l as v,q as w,U as x,N as y,P as z};
