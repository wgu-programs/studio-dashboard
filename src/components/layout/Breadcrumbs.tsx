import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface TitleMap {
  [key: string]: string;
}

export const Breadcrumbs = () => {
  const location = useLocation();
  const [titles, setTitles] = useState<TitleMap>({});

  const fetchItemTitle = async (type: string, id: string) => {
    try {
      let data;
      switch (type) {
        case 'projects':
          const { data: project } = await supabase
            .from('projects')
            .select('name')
            .eq('project_id', id)
            .single();
          data = project?.name;
          break;
        case 'crawlers':
          const { data: crawler } = await supabase
            .from('crawler')
            .select('name')
            .eq('crawler_id', id)
            .single();
          data = crawler?.name;
          break;
        case 'runs':
          const { data: run } = await supabase
            .from('runs')
            .select('name')
            .eq('run_id', id)
            .single();
          data = run?.name;
          break;
        case 'pages':
          const { data: page } = await supabase
            .from('pages')
            .select('title')
            .eq('page_id', id)
            .single();
          data = page?.title;
          break;
        case 'personas':
          const { data: persona } = await supabase
            .from('personas')
            .select('name')
            .eq('persona_id', id)
            .single();
          data = persona?.name;
          break;
      }
      return data || id;
    } catch (error) {
      console.error('Error fetching title:', error);
      return id;
    }
  };

  useEffect(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const fetchTitles = async () => {
      const newTitles: TitleMap = {};
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const nextPath = paths[i + 1];
        if (path && nextPath && !nextPath.includes('-')) continue;
        if (path && nextPath && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nextPath)) {
          const title = await fetchItemTitle(path, nextPath);
          newTitles[nextPath] = title;
        }
      }
      setTitles(newTitles);
    };

    fetchTitles();
  }, [location.pathname]);

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      const label = titles[path] || path.charAt(0).toUpperCase() + path.slice(1);
      const isLast = index === paths.length - 1;
      return { url, label, isLast };
    });
  };

  if (location.pathname === '/') return null;

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          {getBreadcrumbs().map((breadcrumb, index) => (
            <BreadcrumbItem key={breadcrumb.url}>
              {breadcrumb.isLast ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.url}>{breadcrumb.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};