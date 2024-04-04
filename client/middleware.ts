import {NextRequest, NextResponse} from 'next/server';
import {createI18nMiddleware} from 'next-international/middleware';

const I18Middleware = createI18nMiddleware({
    locales:['es', 'en'],
    defaultLocale: 'es'
})

export default function middleware(req: NextRequest){

    const url = req.url;
    const jwt = req.cookies.get('jwt');
    const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

    if(jwt && url.includes('/login') || jwt && url.includes('/signup')){
        return NextResponse.redirect(clientUrl+'/');
    }

    if(!jwt && url.includes('/upload-video')){
        return NextResponse.redirect(clientUrl+'/login');
    }

    if(!jwt && url.includes('/edit-profile')){
        return NextResponse.redirect(clientUrl+'/login');
    }

    if(!jwt && url.includes('/my-videos')){
        return NextResponse.redirect(clientUrl+'/login');
    }

    if(!jwt && url.includes('/my-subscriptions')){
        return NextResponse.redirect(clientUrl+'/login');
    }

    return I18Middleware(req);
}

export const config = {
    matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
  }