"use strict";(()=>{var e={};e.id=9986,e.ids=[9986],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},97750:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>A,patchFetch:()=>N,requestAsyncStorage:()=>p,routeModule:()=>c,serverHooks:()=>l,staticGenerationAsyncStorage:()=>d});var a={};r.r(a),r.d(a,{PATCH:()=>E});var n=r(49303),s=r(88716),o=r(60670),i=r(87070),u=r(13538);async function E(){try{let e=await u._.$queryRawUnsafe(`
      SELECT kcu.CONSTRAINT_NAME as constraintName
      FROM information_schema.KEY_COLUMN_USAGE kcu
      WHERE kcu.TABLE_SCHEMA = DATABASE()
        AND kcu.TABLE_NAME = 'UserEntityModuleProgram'
        AND kcu.COLUMN_NAME = 'userEntityModuleId'
        AND kcu.REFERENCED_TABLE_NAME = 'UserEntityModule'
      LIMIT 1
    `),t=e?.[0]?.constraintName?String(e[0].constraintName):null;if(t)try{await u._.$executeRawUnsafe(`ALTER TABLE \`UserEntityModuleProgram\` DROP FOREIGN KEY \`${t}\``)}catch{}let r=!1;try{await u._.$executeRawUnsafe(`
        ALTER TABLE \`UserEntityModuleProgram\`
        ADD CONSTRAINT \`fk_uemp_userEntityModuleId\`
        FOREIGN KEY (\`userEntityModuleId\`) REFERENCES \`UserEntityModule\`(\`id\`)
        ON DELETE CASCADE ON UPDATE CASCADE
      `),r=!0}catch{}return i.NextResponse.json({ok:!0,adjusted:!0,dropped:t,created:r})}catch(e){return i.NextResponse.json({ok:!1,error:String(e?.message||e)},{status:500})}}let c=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/dev/patch-constraints/route",pathname:"/api/dev/patch-constraints",filename:"route",bundlePath:"app/api/dev/patch-constraints/route"},resolvedPagePath:"C:\\Workspace\\prolinepet_build\\src\\app\\api\\dev\\patch-constraints\\route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:d,serverHooks:l}=c,A="/api/dev/patch-constraints/route";function N(){return(0,o.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:d})}},13538:(e,t,r)=>{r.d(t,{_:()=>n});var a=r(53524);let n=global.prisma??new a.PrismaClient({log:["error","warn"]})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[9276,5972],()=>r(97750));module.exports=a})();