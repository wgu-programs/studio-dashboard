import { Card, CardContent } from '@/components/ui/card';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Page {
	page_id: string;
	url: string;
	title: string | null;
	description: string | null;
	status: string | null;
	screenshot_url: string | null;
}

interface PageCardsProps {
	pages: Page[];
}

export const PageCards = ({ pages }: PageCardsProps) => {
	const navigate = useNavigate();

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
			{pages.map((page) => (
				<Card
					key={page.page_id}
					className='cursor-pointer hover:shadow-lg transition-shadow'
					onClick={() => navigate(`/pages/${page.page_id}`)}>
					<AspectRatio ratio={16 / 9}>
						{page.status === 'queued' ? (
							<div className='w-full h-full bg-muted flex items-center justify-center'>
								<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
							</div>
						) : (
							<img
								src={
									page.screenshot_url ||
									'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
								}
								alt={page.title || 'Page snapshot'}
								className='object-cover w-full h-full'
							/>
						)}
					</AspectRatio>
					<CardContent className='p-4'>
						<h3 className='font-semibold truncate mb-2'>
							{page.title || 'Untitled'}
						</h3>
						<p className='text-sm text-muted-foreground line-clamp-2'>
							{page.description || 'No description'}
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};
