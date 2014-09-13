Linky Square
============
A bookmarklet which let you drag a square to copy links.

This script was created a long time ago. I rewrote it for better readability.

Install
-------
[Drag me][1] to your bookmark toolbar.

Usage
-----
Click the bookmark and drag. Click the bookmark again to exit linky.

[1]: javascript:(function()%7Bwindow.linky%7C%7C(window.linky%3Dfunction()%7Bfunction%20e(e)%7Bfor(var%20n%3D0%2Ct%3D0%3Be%3B)n%2B%3De.offsetLeft%2Ct%2B%3De.offsetTop%2Ce%3De.offsetParent%3Breturn%7Bx%3An%2Cy%3At%7D%7Dfunction%20n()%7Bt%3F(o.off()%2Ci.off()%2Cr.off())%3A(o.on()%2Ci.on()%2Cr.on())%2Ct%3D!t%7Dvar%20t%3D!1%2Co%3Dfunction()%7Bfunction%20e()%7Bl.select()%2Cl.focus()%7Dfunction%20n(n)%7Bn%26%26(l.value%2B%3Dn%2Ce())%7Dfunction%20t(e%2Cn%2Ct%2Co)%7Bvar%20i%3Da.style%3Bi.left%3De%2B%22px%22%2Ci.top%3Dn%2B%22px%22%2Ci.width%3Dt%2B%22px%22%2Ci.height%3Do%2B%22px%22%7Dfunction%20o()%7Bdocument.documentElement.classList.add(%22linky%22)%7Dfunction%20i()%7Bdocument.documentElement.classList.remove(%22linky%22)%2Cl.value%3D%22%22%7Dvar%20r%3Ddocument.createElement(%22style%22)%3Br.textContent%3D%22%09%09%09%09.linky%20.anchor-box%20%7B%09%09%09%09%09%2F*outline%3A%201px%20solid%20yellow!important%3B*%2F%09%09%09%09%09background%3A%20yellow%3B%09%09%09%09%7D%09%09%09%09.select-box%20%7B%09%09%09%09%09border%3A%202px%20dashed%20red%3B%20%09%09%09%09%09box-sizing%3A%20border-box%3B%09%09%09%09%09position%3A%20absolute%3B%20%09%09%09%09%09z-index%3A%2065534%3B%09%09%09%09%09display%3A%20none%3B%09%09%09%09%7D%09%09%09%09.link-box%20%7B%09%09%09%09%09border%3A%203px%20solid%20black%3B%09%09%09%09%09padding%3A%206px%3B%09%09%09%09%09position%3A%20fixed%3B%20%09%09%09%09%09top%3A%204px%3B%09%09%09%09%09left%3A%204px%3B%09%09%09%09%09height%3A%20300px%3B%20%09%09%09%09%09width%3A%20180px%3B%20%09%09%09%09%09background%3A%20white%3B%20%09%09%09%09%09z-index%3A%2065535%3B%20%09%09%09%09%09display%3Anone%3B%09%09%09%09%09pointer-events%3A%20auto%3B%09%09%09%09%7D%09%09%09%09.link-box.link-box-corner%20%7B%09%09%09%09%09top%3A%20auto%3B%09%09%09%09%09left%3A%20auto%3B%09%09%09%09%09right%3A%204px%3B%09%09%09%09%09bottom%3A%204px%3B%09%09%09%09%7D%09%09%09%09.cover%20%7B%09%09%09%09%09position%3A%20fixed%3B%20%09%09%09%09%09width%3A%20100%25%3B%09%09%09%09%09height%3A%20100%25%3B%09%09%09%09%09top%3A%200%3B%20%09%09%09%09%09left%3A%200%3B%09%09%09%09%09z-index%3A%2065533%3B%09%09%09%09%09display%3A%20none%3B%09%09%09%09%7D%09%09%09%09.linky%20body%20%7B%09%09%09%09%09-moz-user-select%3A%20none%3B%09%09%09%09%09-webkit-user-select%3A%20none%3B%09%09%09%09%09pointer-events%3A%20none%3B%09%09%09%09%7D%09%09%09%09.linky%20.link-box%2C%09%09%09%09.linky%20.cover%20%7B%09%09%09%09%09display%3A%20block%3B%09%09%09%09%7D%09%09%09%09.linky-select%20.select-box%20%7B%09%09%09%09%09display%3A%20block%3B%09%09%09%09%7D%09%09%09%22%2Cdocument.head.appendChild(r)%3Bvar%20a%3Ddocument.createElement(%22div%22)%3Ba.className%3D%22select-box%22%3Bvar%20l%3Ddocument.createElement(%22textarea%22)%3Bl.className%3D%22link-box%22%2Cl.onmouseover%3Dfunction()%7Bthis.classList.toggle(%22link-box-corner%22)%7D%3Bvar%20d%3Ddocument.createElement(%22div%22)%3Bd.className%3D%22cover%22%3Bvar%20s%3Ddocument.body%3Breturn%20s.appendChild(a)%2Cs.appendChild(l)%2C%7Bon%3Ao%2Coff%3Ai%2CfocusArea%3Ae%2CupdateArea%3An%2CupdateSelectBox%3At%7D%7D()%2Ci%3Dfunction()%7Bfunction%20n()%7Bo.updateSelectBox(Math.min(Math.min(p%2Cc))%2CMath.min(m%2Cf)%2CMath.abs(p-c)%2CMath.abs(m-f))%7Dfunction%20t(n)%7Bvar%20t%3De(n)%2Co%3Dt.x%2Bn.offsetWidth%2F2%2Ci%3Dt.y%2Bn.offsetHeight%2F2%3Breturn%20Math.min(c%2Cp)%3Eo%3F!1%3Ao%3EMath.max(c%2Cp)%3F!1%3AMath.min(f%2Cm)%3Ei%3F!1%3Ai%3EMath.max(f%2Cm)%3F!1%3A!0%7Dfunction%20i(e)%7Breturn-1!%3De.href.lastIndexOf(%22javascript%3A%22%2C0)%7Dfunction%20r()%7Bvar%20e%2Cn%3Ddocument.querySelectorAll(%22a%5Bhref%5D%22)%3Bfor(e%3D0%3Bn.length%3Ee%3Be%2B%2B)n%5Be%5D.classList.toggle(%22anchor-box%22%2Ct(n%5Be%5D)%26%26!i(n%5Be%5D))%7Dfunction%20a()%7Bn()%2Cr()%7Dfunction%20l()%7Bvar%20e%2Cn%3Ddocument.querySelectorAll(%22a%5Bhref%5D%22)%2Co%3D%22%22%3Bfor(e%3D0%3Bn.length%3Ee%3Be%2B%2B)t(n%5Be%5D)%26%26!i(n%5Be%5D)%26%26(o%2B%3Dn%5Be%5D.href%2B%22%5Cn%22)%3Breturn%20o%7Dfunction%20d(e)%7Bif(%22mousedown%22%3D%3De.type)%7Bif(x)return%3Bx%3D!0%2Cp%3Dc%3De.pageX%2Cm%3Df%3De.pageY%2Ca()%2Cdocument.body.classList.add(%22linky-select%22)%7Delse%20if(%22mousemove%22%3D%3De.type)%7Bif(!x)return%3Bp%3De.pageX%2Cm%3De.pageY%2Ca()%7Delse%20if(%22mouseup%22%3D%3De.type)%7Bif(!x)return%3Bo.updateArea(l())%2Cx%3D!1%2Cdocument.body.classList.remove(%22linky-select%22)%7D%7Dfunction%20s()%7Bv%7C%7C(window.addEventListener(%22mousedown%22%2Cd)%2Cwindow.addEventListener(%22mousemove%22%2Cd)%2Cwindow.addEventListener(%22mouseup%22%2Cd)%2Cv%3D!0)%7Dfunction%20u()%7Bwindow.removeEventListener(%22mousedown%22%2Cd)%2Cwindow.removeEventListener(%22mousemove%22%2Cd)%2Cwindow.removeEventListener(%22mouseup%22%2Cd)%2Cv%3D!1%7Dvar%20c%3D0%2Cf%3D0%2Cp%3D0%2Cm%3D0%2Cv%3D!1%2Cx%3D!1%3Breturn%7Bon%3As%2Coff%3Au%7D%7D()%2Cr%3Dfunction()%7Bfunction%20e(e)%7B9!%3De.keyCode%7C%7Ce.ctrlKey%7C%7Ce.shiftKey%7C%7Ce.altKey%7C%7C(e.preventDefault()%2Co.focusArea())%7Dfunction%20n()%7Bwindow.removeEventListener(%22keydown%22%2Ce)%2Ci%3D!1%7Dfunction%20t()%7Bi%7C%7C(window.addEventListener(%22keydown%22%2Ce)%2Ci%3D!0)%7Dvar%20i%3D!1%3Breturn%7Bon%3At%2Coff%3An%7D%7D()%3Breturn%7Btoggle%3An%7D%7D())%2Cwindow.linky.toggle()%3B%7D)()